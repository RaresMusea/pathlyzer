variable "db_username" {
  type        = string
  description = "Username for the PostgreSQL database"
}

variable "db_password" {
  type        = string
  description = "Password for the PostgreSQL database"
  sensitive   = true
}

variable "subnet_id" {
  type        = string
  description = "Subnet ID where the RDS instance will be deployed"
  sensitive   = false
}

variable "security_group_id" {
  type        = string
  description = "Security group ID to allow access to the RDS instance"
  sensitive   = true
}