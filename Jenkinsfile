#!/usr/bin/env groovy

pipeline {
    agent any
    environment {
        outDir = credentials('darkhax_docs_out_dir')
    }
    stages {
        stage('Setup') {
            steps {
                echo 'Setting up npm'
                sh 'npm i'
            }
        }
        stage('Build') {
            steps {
                echo 'Building files'
                sh 'npm run build'
            }
        }
    }
    options {
        disableConcurrentBuilds()
    }
}
