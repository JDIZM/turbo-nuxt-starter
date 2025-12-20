# Service accounts for Cloud Run services
resource "google_service_account" "api_service" {
  account_id   = "turbo-api-service"
  display_name = "Turbo API Service Account"
  description  = "Service account for the Express API Cloud Run service"
}

resource "google_service_account" "nuxt_service" {
  account_id   = "turbo-nuxt-service"
  display_name = "Turbo Nuxt Service Account"
  description  = "Service account for the Nuxt Cloud Run service"
}

resource "google_service_account" "docus_service" {
  account_id   = "turbo-docus-service"
  display_name = "Turbo Docus Service Account"
  description  = "Service account for the Docus Cloud Run service"
}

# Allow GitHub Actions service account to impersonate Cloud Run service accounts
# This is required for deploying Cloud Run services from GitHub Actions
resource "google_service_account_iam_member" "github_actAs_api" {
  service_account_id = google_service_account.api_service.name
  role               = "roles/iam.serviceAccountUser"
  member             = "serviceAccount:${google_service_account.github_actions.email}"
}

resource "google_service_account_iam_member" "github_actAs_nuxt" {
  service_account_id = google_service_account.nuxt_service.name
  role               = "roles/iam.serviceAccountUser"
  member             = "serviceAccount:${google_service_account.github_actions.email}"
}

resource "google_service_account_iam_member" "github_actAs_docus" {
  service_account_id = google_service_account.docus_service.name
  role               = "roles/iam.serviceAccountUser"
  member             = "serviceAccount:${google_service_account.github_actions.email}"
}

# Express API Cloud Run Service
resource "google_cloud_run_v2_service" "api" {
  name     = var.api_service_name
  location = var.region

  template {
    service_account = google_service_account.api_service.email

    containers {
      image = "${var.region}-docker.pkg.dev/${var.project_id}/${var.repository_name}/api:latest"

      ports {
        container_port = 3002
      }

      env {
        name  = "NODE_ENV"
        value = "production"
      }

      env {
        name  = "API_PORT"
        value = "3002"
      }

      env {
        name  = "LOG_LEVEL"
        value = "info"
      }

      env {
        name  = "CORS_ORIGIN"
        value = var.nuxt_domain != "" ? "https://${var.nuxt_domain}" : "*"
      }

      env {
        name = "DATABASE_URL"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.database_url.secret_id
            version = "latest"
          }
        }
      }

      env {
        name = "SUPABASE_URL"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.supabase_url.secret_id
            version = "latest"
          }
        }
      }

      env {
        name = "SUPABASE_ANON_KEY"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.supabase_anon_key.secret_id
            version = "latest"
          }
        }
      }

      env {
        name = "SUPABASE_AUTH_JWT_SECRET"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.supabase_jwt_secret.secret_id
            version = "latest"
          }
        }
      }

      resources {
        limits = {
          cpu    = var.api_cpu
          memory = var.api_memory
        }
      }

      startup_probe {
        http_get {
          path = "/health"
          port = 3002
        }
        initial_delay_seconds = 10
        period_seconds        = 10
        failure_threshold     = 3
      }

      liveness_probe {
        http_get {
          path = "/health"
          port = 3002
        }
        period_seconds    = 30
        failure_threshold = 3
      }
    }

    scaling {
      min_instance_count = var.min_instances
      max_instance_count = var.max_instances
    }
  }

  traffic {
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }

  depends_on = [
    google_project_service.required_apis,
    google_artifact_registry_repository.containers,
  ]
}

# Nuxt Frontend Cloud Run Service
resource "google_cloud_run_v2_service" "nuxt" {
  name     = var.nuxt_service_name
  location = var.region

  template {
    service_account = google_service_account.nuxt_service.email

    containers {
      image = "${var.region}-docker.pkg.dev/${var.project_id}/${var.repository_name}/nuxt:latest"

      ports {
        container_port = 3001
      }

      env {
        name  = "NODE_ENV"
        value = "production"
      }

      env {
        name  = "NUXT_PUBLIC_API_BASE"
        value = var.api_domain != "" ? "https://${var.api_domain}" : "https://${var.api_service_name}-${data.google_project.current.number}.${var.region}.run.app"
      }

      resources {
        limits = {
          cpu    = var.nuxt_cpu
          memory = var.nuxt_memory
        }
      }

      startup_probe {
        http_get {
          path = "/"
          port = 3001
        }
        initial_delay_seconds = 10
        period_seconds        = 10
        failure_threshold     = 3
      }
    }

    scaling {
      min_instance_count = var.min_instances
      max_instance_count = var.max_instances
    }
  }

  traffic {
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }

  depends_on = [
    google_project_service.required_apis,
    google_artifact_registry_repository.containers,
  ]
}

# Docus Documentation Cloud Run Service
resource "google_cloud_run_v2_service" "docus" {
  name     = var.docus_service_name
  location = var.region

  template {
    service_account = google_service_account.docus_service.email

    containers {
      image = "${var.region}-docker.pkg.dev/${var.project_id}/${var.repository_name}/docus:latest"

      ports {
        container_port = 80
      }

      resources {
        limits = {
          cpu    = "1"
          memory = "512Mi"
        }
      }

      startup_probe {
        http_get {
          path = "/"
          port = 80
        }
        initial_delay_seconds = 5
        period_seconds        = 5
        failure_threshold     = 3
      }
    }

    scaling {
      min_instance_count = 0
      max_instance_count = 5
    }
  }

  traffic {
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }

  depends_on = [
    google_project_service.required_apis,
    google_artifact_registry_repository.containers,
  ]
}

# Allow unauthenticated access to services (public APIs)
resource "google_cloud_run_v2_service_iam_member" "api_public" {
  name     = google_cloud_run_v2_service.api.name
  location = var.region
  role     = "roles/run.invoker"
  member   = "allUsers"
}

resource "google_cloud_run_v2_service_iam_member" "nuxt_public" {
  name     = google_cloud_run_v2_service.nuxt.name
  location = var.region
  role     = "roles/run.invoker"
  member   = "allUsers"
}

resource "google_cloud_run_v2_service_iam_member" "docus_public" {
  name     = google_cloud_run_v2_service.docus.name
  location = var.region
  role     = "roles/run.invoker"
  member   = "allUsers"
}
