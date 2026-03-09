pipeline {
    agent any

    stages {
        stage('Deploy') {
            steps {
            sh '''
            set -e

            echo "===> Build & deploy from Jenkins workspace"
            cd /var/lib/jenkins/workspace/net-BE

            echo "===> Stop containers"
            docker compose down --remove-orphans || true

            echo "===> Build image without cache"
            docker compose build --no-cache

            echo "===> Run containers"
            docker compose up -d

            echo "===> Cleanup unused images"
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
