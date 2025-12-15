# Secret Manager secrets for sensitive configuration

# Database URL
resource "google_secret_manager_secret" "database_url" {
  secret_id = "database-url"

  replication {
    auto {}
  }

  depends_on = [google_project_service.required_apis]
}

resource "google_secret_manager_secret_version" "database_url" {
  count       = var.database_url != "" ? 1 : 0
  secret      = google_secret_manager_secret.database_url.id
  secret_data = var.database_url
}

# Supabase URL
resource "google_secret_manager_secret" "supabase_url" {
  secret_id = "supabase-url"

  replication {
    auto {}
  }

  depends_on = [google_project_service.required_apis]
}

resource "google_secret_manager_secret_version" "supabase_url" {
  count       = var.supabase_url != "" ? 1 : 0
  secret      = google_secret_manager_secret.supabase_url.id
  secret_data = var.supabase_url
}

# Supabase Anon Key
resource "google_secret_manager_secret" "supabase_anon_key" {
  secret_id = "supabase-anon-key"

  replication {
    auto {}
  }

  depends_on = [google_project_service.required_apis]
}

resource "google_secret_manager_secret_version" "supabase_anon_key" {
  count       = var.supabase_anon_key != "" ? 1 : 0
  secret      = google_secret_manager_secret.supabase_anon_key.id
  secret_data = var.supabase_anon_key
}

# Supabase JWT Secret
resource "google_secret_manager_secret" "supabase_jwt_secret" {
  secret_id = "supabase-jwt-secret"

  replication {
    auto {}
  }

  depends_on = [google_project_service.required_apis]
}

resource "google_secret_manager_secret_version" "supabase_jwt_secret" {
  count       = var.supabase_jwt_secret != "" ? 1 : 0
  secret      = google_secret_manager_secret.supabase_jwt_secret.id
  secret_data = var.supabase_jwt_secret
}

# Grant Cloud Run service accounts access to secrets
resource "google_secret_manager_secret_iam_member" "api_database_url" {
  secret_id = google_secret_manager_secret.database_url.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.api_service.email}"
}

resource "google_secret_manager_secret_iam_member" "api_supabase_url" {
  secret_id = google_secret_manager_secret.supabase_url.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.api_service.email}"
}

resource "google_secret_manager_secret_iam_member" "api_supabase_anon_key" {
  secret_id = google_secret_manager_secret.supabase_anon_key.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.api_service.email}"
}

resource "google_secret_manager_secret_iam_member" "api_supabase_jwt_secret" {
  secret_id = google_secret_manager_secret.supabase_jwt_secret.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.api_service.email}"
}
