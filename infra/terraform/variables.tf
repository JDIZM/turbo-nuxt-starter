variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "region" {
  description = "GCP region for Cloud Run services"
  type        = string
  default     = "europe-west1"
}

variable "environment" {
  description = "Environment name (e.g., production, staging)"
  type        = string
  default     = "production"
}

variable "repository_name" {
  description = "Artifact Registry repository name"
  type        = string
  default     = "turbo-repo"
}

# Service configurations
variable "api_service_name" {
  description = "Name for the API Cloud Run service"
  type        = string
  default     = "turbo-api"
}

variable "nuxt_service_name" {
  description = "Name for the Nuxt Cloud Run service"
  type        = string
  default     = "turbo-nuxt"
}

variable "docus_service_name" {
  description = "Name for the Docus Cloud Run service"
  type        = string
  default     = "turbo-docus"
}

# Resource limits
variable "api_cpu" {
  description = "CPU limit for API service"
  type        = string
  default     = "1"
}

variable "api_memory" {
  description = "Memory limit for API service"
  type        = string
  default     = "512Mi"
}

variable "nuxt_cpu" {
  description = "CPU limit for Nuxt service"
  type        = string
  default     = "1"
}

variable "nuxt_memory" {
  description = "Memory limit for Nuxt service"
  type        = string
  default     = "512Mi"
}

# Scaling configuration
variable "min_instances" {
  description = "Minimum number of instances (0 for scale to zero)"
  type        = number
  default     = 0
}

variable "max_instances" {
  description = "Maximum number of instances"
  type        = number
  default     = 10
}

# Domain configuration (optional)
variable "api_domain" {
  description = "Custom domain for API service (optional)"
  type        = string
  default     = ""
}

variable "nuxt_domain" {
  description = "Custom domain for Nuxt service (optional)"
  type        = string
  default     = ""
}

# Database configuration
variable "database_url" {
  description = "PostgreSQL connection string (stored in Secret Manager)"
  type        = string
  sensitive   = true
  default     = ""
}

variable "supabase_url" {
  description = "Supabase project URL"
  type        = string
  default     = ""
}

variable "supabase_anon_key" {
  description = "Supabase anonymous key"
  type        = string
  sensitive   = true
  default     = ""
}

variable "supabase_jwt_secret" {
  description = "Supabase JWT secret for auth verification"
  type        = string
  sensitive   = true
  default     = ""
}

# GitHub configuration
variable "github_owner" {
  description = "GitHub repository owner (user or organization)"
  type        = string
  default     = "JDIZM"
}

variable "github_repo" {
  description = "GitHub repository name"
  type        = string
  default     = "turbo-nuxt-starter"
}
