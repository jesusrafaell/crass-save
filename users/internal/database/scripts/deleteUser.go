package scripts

import (
	"fmt"
	"log"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

// UserIDs que quieres eliminar
var userIDs = []string{}

func DeleteUser(db *sqlx.DB) {

	failedDeletions := make([]string, 0)

	for _, userID := range userIDs {
		// Intentar borrar los registros
		err := deleteUserRecords(db, userID)
		if err != nil {
			// Si falla, agregar a la lista de fallos
			log.Printf("Failed to delete records for user_id: %s, error: %v\n", userID, err)
			failedDeletions = append(failedDeletions, userID)
		}
	}

	// Mostrar el reporte de eliminaciones fallidas
	if len(failedDeletions) > 0 {
		fmt.Printf("Failed to delete the following user records: %v\n", failedDeletions)
	} else {
		fmt.Println("All user records deleted successfully.")
	}
}

// Función para eliminar los registros relacionados a un usuario
func deleteUserRecords(db *sqlx.DB, userID string) error {
	tx, err := db.Beginx() // Iniciar una transacción
	if err != nil {
		return err
	}

	// Borrar de u_users_location
	_, err = tx.Exec("DELETE FROM public.u_users_location WHERE user_id = $1", userID)
	if err != nil {
		tx.Rollback() // Deshacer si falla
		return fmt.Errorf("error deleting from u_users_location: %w", err)
	}

	// Borrar de u_verify_tokens
	_, err = tx.Exec("DELETE FROM u_verify_tokens WHERE user_id = $1", userID)
	if err != nil {
		tx.Rollback() // Deshacer si falla
		return fmt.Errorf("error deleting from u_verify_tokens: %w", err)
	}

	// Borrar de u_users
	_, err = tx.Exec("DELETE FROM public.u_users WHERE id = $1", userID)
	if err != nil {
		tx.Rollback() // Deshacer si falla
		return fmt.Errorf("error deleting from u_users: %w", err)
	}

	// Confirmar la transacción si todo fue bien
	err = tx.Commit()
	if err != nil {
		return fmt.Errorf("error committing transaction: %w", err)
	}

	fmt.Printf("Deleted records for user_id: %s\n", userID)
	return nil
}

// delete from public.a_assistance_requests where user_id = '9ed6909c-20c4-41a4-a4f3-e5dcfbad03fb'
