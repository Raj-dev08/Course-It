pipeline {
    agent any

    environment {
        //env vars
    }
    stages {
        stage('Hello') {
            steps {
                echo 'Hello from Jenkins Pipeline!'
                echo 'how are you fellas ?'
            }
        }
        stage('env'){
            steps{
                dir('backend') {
                    echo 'Creating .env file for Docker Compose...'
                    writeFile file: '.env', text: """
                        MONGODB_URI=${env.MONGODB_URI}
                        PORT=${env.PORT}
                        JWT_SECRET=${env.JWT_SECRET}
                        NODE_ENV=${env.NODE_ENV}   
                        CLOUDINARY_CLOUD_NAME=${env.CLOUDINARY_CLOUD_NAME}
                        CLOUDINARY_API_KEY=${env.CLOUDINARY_API_KEY}
                        CLOUDINARY_API_SECRET=${env.CLOUDINARY_API_SECRET}
                        UPSTASH_REDIS_URL=${env.UPSTASH_REDIS_URL}
                        ADMIN_PASSWORD=${env.ADMIN_PASSWORD}
                        ARCJET_KEY=${env.ARCJET_KEY}
                        STEAM_API_KEY=${env.STEAM_API_KEY}
                        STEAM_API_SECRET=${env.STEAM_API_SECRET}
                    """
            }
            dir('frontend') {
                echo 'Creating .env file for Frontend...'
                writeFile file: '.env', text: """
                    VITE_STREAM_API_KEY=${env.VITE_STREAM_API_KEY}
                """
            }
            }
        }
        stage('Build and Install') {
            steps {
               echo 'Buildind from root'
               bat 'npm run clean'
               bat 'set NODE_ENV=development && npm run build'
            }
        }
        stage('Run'){
            steps {
                dir('backend') {
                    echo 'Starting backend server...'
                    bat 'docker compose up -d'
                }
            }
        }
    }
}