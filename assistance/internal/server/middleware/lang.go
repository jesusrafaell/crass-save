package middleware

// func LangRequest(next echo.HandlerFunc) echo.HandlerFunc {
// 	return func(c echo.Context) error {
// 		lang := c.Request().Header.Get("lang")
// 		if lang == "" {
// 			lang = "es"
// 		}
// 		c.Set("lang", lang)
// 		// ctx := context.WithValue(ctx, LangKey, lang)
// 		ctx := context.WithValue(c.Request().Context(), types.LangKey, lang)
// 		c.SetRequest(c.Request().WithContext(ctx))

// 		return next(c)
// 	}
// }
