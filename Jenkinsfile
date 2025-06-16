pipeline {
    agent any

    environment {
        MONGODB_URI="mongodb://admin:password@mongo:27017/mydbname?authSource=admin"
        PORT=5000

        JWT_SECRET="3b4ab1987b62199a05274250638646f243be808c9d0e1df668d69b0a2e98fc33"
        NODE_ENV="production"


        CLOUDINARY_CLOUD_NAME="dnvmiiboh"
        CLOUDINARY_API_KEY="877159668992191"
        CLOUDINARY_API_SECRET="dN-tjFvgb7blUiaO26-OTELmwXo"

        UPSTASH_REDIS_URL="redis://redis:6379"
        ADMIN_PASSWORD="hailhitler123"

        ARCJET_KEY="ajkey_01jv6xz7xcfykvqvadsctbbwpq"

        STEAM_API_KEY="4fbycczcyynb"
        STEAM_API_SECRET="8gxz9yejcfqu5gwdgdrhnsbhjnrzy6mtgszmxkhfrb4r643bd4pm9qb9ckf9upq3"
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
                bat 'npm run build'
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