import type { Application } from "express"
import swaggerUi from "swagger-ui-express"
import { logger } from "logger"
import { generateOpenAPIDocument } from "./openapi.ts"

export const setupSwagger = (app: Application): void => {
  // Only enable Swagger/OpenAPI documentation in development and test environments
  // Production exposure is a security risk as it reveals API structure
  if (process.env.NODE_ENV === "production") {
    logger.info("Swagger UI disabled in production for security")
    return
  }

  try {
    const document = generateOpenAPIDocument()

    // Serve Swagger UI
    app.use("/docs", swaggerUi.serve)
    app.get(
      "/docs",
      swaggerUi.setup(document, {
        customCss: `
        .swagger-ui .topbar { display: none }
        .swagger-ui .info { margin: 20px 0 }
      `,
        customSiteTitle: "Turbo Nuxt Starter API Documentation"
      })
    )

    // Serve OpenAPI JSON spec
    app.get("/openapi.json", (_req, res) => {
      res.setHeader("Content-Type", "application/json")
      res.send(document)
    })

    logger.info(
      `Swagger UI setup complete - available at /docs (${process.env.NODE_ENV || "development"} only)`
    )
  } catch (error) {
    logger.error({ error }, "Failed to setup Swagger UI")
  }
}
