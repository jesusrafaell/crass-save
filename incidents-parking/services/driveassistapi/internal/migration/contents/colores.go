package contents

import (
	"api/driveassist/data/model"
	"api/driveassist/internal/repository"
	"fmt"
	"log"

	"gorm.io/gorm"
)

var listColor = []model.Color{
	{EN: "Black", ES: "Negro", HEX: "#000000"},
	{EN: "Yellow", ES: "Amarillo", HEX: "#FFFF00"},
	{EN: "Orange", ES: "Naranja", HEX: "#FFA500"},
	{EN: "Purple", ES: "Púrpura", HEX: "#800080"},
	{EN: "Red", ES: "Rojo", HEX: "#FF0000"},
	{EN: "Green", ES: "Verde", HEX: "#008000"},
	{EN: "Blue", ES: "Azul", HEX: "#0000FF"},
	{EN: "Gray", ES: "Gris", HEX: "#808080"},
	{EN: "Beige", ES: "Beige", HEX: "#F5F5DC"},
	{EN: "Silver", ES: "Plata", HEX: "#C0C0C0"},
	{EN: "White", ES: "Blanco", HEX: "#FFFFFF"},
	{EN: "Gold", ES: "Oro", HEX: "#FFD700"},
	{EN: "Brown", ES: "Marrón", HEX: "#A52A2A"},
	{EN: "Bronze", ES: "Bronce", HEX: "#CD7F32"},
	{EN: "Pink", ES: "Rosa", HEX: "#FFC0CB"},
	{EN: "Turquoise", ES: "Turquesa", HEX: "#40E0D0"},
	{EN: "Sky Blue", ES: "Cielo", HEX: "#87CEEB"},
	{EN: "Lime", ES: "Lima", HEX: "#00FF00"},
	{EN: "Emerald", ES: "Esmeralda", HEX: "#50C878"},
	{EN: "Magenta", ES: "Magenta", HEX: "#FF00FF"},
	{EN: "Lavender", ES: "Lavanda", HEX: "#E6E6FA"},
	{EN: "Caramel", ES: "Caramelo", HEX: "#C68E17"},
	{EN: "Cream", ES: "Crema", HEX: "#FFFDD0"},
	{EN: "Teal", ES: "Verde Azulado", HEX: "#008080"},
	{EN: "Olive", ES: "Oliva", HEX: "#808000"},
	{EN: "Maroon", ES: "Granate", HEX: "#800000"},
	{EN: "Navy Blue", ES: "Azul Marino", HEX: "#000080"},
	{EN: "Violet", ES: "Violeta", HEX: "#8A2BE2"},
	{EN: "Indigo", ES: "Índigo", HEX: "#4B0082"},
	{EN: "Copper", ES: "Cobre", HEX: "#B87333"},
	{EN: "Charcoal", ES: "Carbón", HEX: "#36454F"},
	{EN: "Sapphire", ES: "Zafiro", HEX: "#0F52BA"},
	{EN: "Rust", ES: "Óxido", HEX: "#B7410E"},
	{EN: "Cyan", ES: "Cian", HEX: "#00FFFF"},
	{EN: "Mint Green", ES: "Verde Menta", HEX: "#98FF98"},
	{EN: "Mustard", ES: "Mostaza", HEX: "#FFDB58"},
	{EN: "Plum", ES: "Ciruela", HEX: "#DDA0DD"},
	{EN: "Taupe", ES: "Topo", HEX: "#483C32"},
	{EN: "Peach", ES: "Durazno", HEX: "#FFE5B4"},
	{EN: "Burgundy", ES: "Burdeos", HEX: "#800020"},
	{EN: "Ivory", ES: "Marfil", HEX: "#FFFFF0"},
	{EN: "Sand", ES: "Arena", HEX: "#C2B280"},
	{EN: "Moss Green", ES: "Verde Musgo", HEX: "#8A9A5B"},
	{EN: "Pearl", ES: "Perla", HEX: "#EAE0C8"},
	{EN: "Champagne", ES: "Champaña", HEX: "#F7E7CE"},
	{EN: "Electric Blue", ES: "Azul Eléctrico", HEX: "#7DF9FF"},
	{EN: "Lemon", ES: "Limón", HEX: "#FFF700"},
}

func SaveColor(db *gorm.DB) {
	repo := repository.NewColorRepository(db)
	for _, c := range listColor {
		err := repo.Create(&c)
		if err != nil {
			log.Fatalf("Error saving color -> EN: %s, ES: %s,  HEX: %s, Error: %v\n", c.EN, c.ES, c.HEX, err)
		} else {
			fmt.Printf("Color: EN:%s, ES:%s  HEX: %s\n", c.EN, c.ES, c.HEX)
		}
	}
}
