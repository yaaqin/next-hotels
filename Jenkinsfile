pipeline {
  agent any

  stages {

    stage('Deploy') {
      steps {
        sh '''
        set -e

        echo "Go to project directory"
        cd /home/yaaqin/apps/next-hotels

        echo "Pull latest code"
        git pull origin main

        echo "Stop old container"
        docker compose down || true

        echo "Build image"
        docker compose build

        echo "Start container"
        docker compose up -d
        '''
      }
    }

  }

  post {
    success {
      echo "✅ Deploy success"
    }
    failure {
      echo "❌ Deploy failed"
    }
  }
}