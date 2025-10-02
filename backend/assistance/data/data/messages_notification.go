package data

import (
	"bitbucket.org/mya/mya-assistance-core/types"
)

var (
	MessageAccepted = types.MessageNotif{
		Title:   "Tu servicio fue aceptado",
		Message: "Un conductor ha aceptado tu servicio",
		Sound:   "",
	}
	MessageConfirmed = types.MessageNotif{
		Title:   "El usuario ha aceptada",
		Message: "El usuario ha confirmado el servicio",
		Sound:   "",
	}
	MessageCancelled = types.MessageNotif{
		Title:   "Tu servicio fue cancelado",
		Message: "Se ha cancelado tu servicio",
		Sound:   "",
	}
	MessageToUser = types.MessageNotif{
		Title:   "El conductor va en camino",
		Message: "El conductor va en camino a tu ubicación",
		Sound:   "",
	}
	MessageArrivedUser = types.MessageNotif{
		Title:   "El conductor ha llegado",
		Message: "El conductor ha llegado a tu ubicación",
		Sound:   "",
	}
	MessageToDestination = types.MessageNotif{
		Title:   "El conductor va al destino",
		Message: "El conductor va en camino al destino",
		Sound:   "",
	}
	MessageArrivedDestination = types.MessageNotif{
		Title:   "El conductor llegó al destino",
		Message: "El conductor ha llegado al destino",
		Sound:   "",
	}
	MessageDriverCompleted = types.MessageNotif{
		Title:   "El servicio fue completado",
		Message: "El conductor ha completado el servicio",
		Sound:   "",
	}
	MessagePending = types.MessageNotif{
		Title:   "Servicio pendiente",
		Message: "Tienes un servicio pendiente",
		Sound:   "",
	}
	MessageMaxTimeReached = types.MessageNotif{
		Title:   "Tu servicio fue cancelado",
		Message: "Se ha cancelado tu servicio, no se consiguio conductor",
		Sound:   "",
	}
	MessageMaxTimeReachedUser = types.MessageNotif{
		Title:   "Tu servicio fue cancelado",
		Message: "Se ha cancelado tu servicio, el usuario no confirmo el precio",
	}
)
