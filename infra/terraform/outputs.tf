output "artifact_registry_url" {
  description = "URL for the Artifact Registry repository"
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/${var.repository_name}"
}

output "api_service_url" {
  description = "URL for the API Cloud Run service"
  value       = google_cloud_run_v2_service.api.uri
}

output "nuxt_service_url" {
  description = "URL for the Nuxt Cloud Run service"
  value       = google_cloud_run_v2_service.nuxt.uri
}

output "docus_service_url" {
  description = "URL for the Docus Cloud Run service"
  value       = google_cloud_run_v2_service.docus.uri
}

output "github_actions_service_account" {
  description = "Email of the GitHub Actions service account"
  value       = google_service_account.github_actions.email
}

output "workload_identity_provider" {
  description = "Workload Identity Provider for GitHub Actions"
  value       = google_iam_workload_identity_pool_provider.github.name
}

output "docker_push_commands" {
  description = "Commands to push images to Artifact Registry"
  value       = <<-EOT
    # Configure Docker authentication
    gcloud auth configure-docker ${var.region}-docker.pkg.dev

    # Build and push images
    docker build -f apps/api/Dockerfile -t ${var.region}-docker.pkg.dev/${var.project_id}/${var.repository_name}/api:latest .
    docker push ${var.region}-docker.pkg.dev/${var.project_id}/${var.repository_name}/api:latest

    docker build -f apps/nuxt/Dockerfile -t ${var.region}-docker.pkg.dev/${var.project_id}/${var.repository_name}/nuxt:latest .
    docker push ${var.region}-docker.pkg.dev/${var.project_id}/${var.repository_name}/nuxt:latest

    docker build -f apps/docus/Dockerfile -t ${var.region}-docker.pkg.dev/${var.project_id}/${var.repository_name}/docus:latest .
    docker push ${var.region}-docker.pkg.dev/${var.project_id}/${var.repository_name}/docus:latest
  EOT
}
