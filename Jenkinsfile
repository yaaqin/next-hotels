pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                set -e

                echo "Workspace:"
                pwd

                echo "Files:"
                ls -la

                echo "Stop containers"
                docker compose down --remove-orphans || true

                echo "Build image"
                docker compose build --no-cache

                echo "Run containers"
                docker compose up -d

                echo "Cleanup images"
                docker image prune -f
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Deploy success'
        }
        failure {
            echo '❌ Deploy failed'
        }
    }
}