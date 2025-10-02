package services

import (
	"bytes"
	"context"
	t "crashsaver/photos/types"
	"crashsaver/photos/utils"
	"fmt"
	"image"
	"image/jpeg"
	"mime/multipart"
	"os"
	"path/filepath"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/aws/aws-sdk-go-v2/service/s3/types"
	"github.com/disintegration/imaging"
)

type UploadPhotoService struct {
	bucketName string
	region     string
	s3Client   *s3.Client
}

func NewUploadPhotoService() *UploadPhotoService {
	bucketName := os.Getenv("BUCKET_NAME")
	region := os.Getenv("REGION_S3")
	accessKeyID := os.Getenv("ACCESS_KEY_S3")
	secretAccessKey := os.Getenv("SECRET_ACCESS_KEY_S3")

	cfg, err := config.LoadDefaultConfig(context.TODO(),
		config.WithRegion(region),
		config.WithCredentialsProvider(credentials.NewStaticCredentialsProvider(accessKeyID, secretAccessKey, "")),
	)
	if err != nil {
		panic("configuration error, " + err.Error())
	}

	s3Client := s3.NewFromConfig(cfg)

	return &UploadPhotoService{
		bucketName: bucketName,
		region:     region,
		s3Client:   s3Client,
	}
}

func (ups *UploadPhotoService) compressPhoto(img image.Image) ([]byte, error) {
	// In this example, we just encode the image to JPEG format without resizing,
	// assuming the input is already the desired size. Modify as needed.
	buf := new(bytes.Buffer)
	err := jpeg.Encode(buf, img, nil)
	if err != nil {
		return nil, err
	}
	return buf.Bytes(), nil
}

func (ups *UploadPhotoService) createThumbnail(img image.Image) ([]byte, error) {
	thumb := imaging.Resize(img, 210, 0, imaging.Lanczos)
	buf := new(bytes.Buffer)
	err := jpeg.Encode(buf, thumb, nil)
	if err != nil {
		return nil, err
	}
	return buf.Bytes(), nil
}

func (ups *UploadPhotoService) uploadToS3(key string, body []byte, contentType string) (string, error) {
	_, err := ups.s3Client.PutObject(context.TODO(), &s3.PutObjectInput{
		Bucket:      aws.String(ups.bucketName),
		Key:         aws.String(key),
		Body:        bytes.NewReader(body),
		ACL:         types.ObjectCannedACLPublicRead,
		ContentType: aws.String(contentType),
	})
	if err != nil {
		return "", err
	}

	return fmt.Sprintf("https://%s.s3.%s.amazonaws.com/%s", ups.bucketName, ups.region, key), nil
}

func (ups *UploadPhotoService) UploadPhoto(userId string, fileHeader *multipart.FileHeader) (*t.UploadPhotoReponse, error) {
	src, err := fileHeader.Open()
	if err != nil {
		return nil, err
	}

	defer src.Close()

	// valid extension
	if !utils.ValidExtension(fileHeader.Filename) {
		return nil, fmt.Errorf("invalid file extension")
	}

	img, _, err := image.Decode(src)
	if err != nil {
		return nil, err
	}

	timestamp := time.Now().Unix()
	fileExtension := filepath.Ext(fileHeader.Filename)
	fileName := fmt.Sprintf("%d%s", timestamp, fileExtension)
	contentType := "image/jpeg"

	compressedPhoto, err := ups.compressPhoto(img)
	if err != nil {
		return nil, err
	}

	thumbnail, err := ups.createThumbnail(img)
	if err != nil {
		return nil, err
	}

	urlPhoto, err := ups.uploadToS3(fmt.Sprintf("%s/%s", userId, fileName), compressedPhoto, contentType)
	if err != nil {
		return nil, err
	}

	urlThumbnail, err := ups.uploadToS3(fmt.Sprintf("%s/%s_thumbnail%s", userId, fileName, fileExtension), thumbnail, contentType)
	if err != nil {
		return nil, err
	}

	return &t.UploadPhotoReponse{
		UrlPhoto:     urlPhoto,
		UrlThumbnail: urlThumbnail,
	}, nil
}
