pipeline {
    agent any

    // 由 GitHub Webhook 触发
    triggers {
        githubPush()
    }

    environment {
        // 设置 Node.js 版本 (根据你的项目需求调整)
        NODE_VERSION = '20'
        
        // 部署目录 (根据你的服务器配置调整)
        DEPLOY_DIR = '/www/wwwroot/www.firzx.com_88'
        
        // 临时构建目录
        BUILD_DIR = 'docs/.vitepress/dist'
    }

    stages {
        stage('Setup Node.js') {
            steps {
                script {
                    // 使用指定的 Node.js 版本
                    nvmInstall = """
                        if [ -f ~/.nvm/nvm.sh ]; then
                            . ~/.nvm/nvm.sh
                            nvm install ${NODE_VERSION}
                            nvm use ${NODE_VERSION}
                        fi
                    """
                    sh nvmInstall
                    
                    // 检查 Node.js 和 npm 版本
                    sh 'node --version'
                    sh 'npm --version'
                }
            }
        }

        stage('Checkout') {
            steps {
                // 从 Git 仓库拉取代码
                git(
                    url: 'https://github.com/GodX-18/blog.git',
                    credentialsId: '656f9887-8daa-4055-8706-41a0c156b66a',
                    branch: 'master'  // 或你的主分支名称
                )
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run docs:build'
                
                // 验证构建产物
                sh 'ls -la ${BUILD_DIR}'
            }
        }

        stage('Deploy') {
            steps {
                script {
                    // 使用 SSH 插件部署到服务器
                    sshPublisher(
                        publishers: [
                            sshPublisherDesc(
                                configName: 'Blog', // 在Jenkins系统配置中设置的SSH服务器名称
                                transfers: [
                                    sshTransfer(
                                        sourceFiles: "${BUILD_DIR}/**", // 传输所有构建产物
                                        removePrefix: "${BUILD_DIR}",   // 移除dist前缀
                                        remoteDirectory: "${DEPLOY_DIR}", // 远程部署目录
                                        execCommand: """
                                            # 可选：备份旧版本
                                            backup_dir="${DEPLOY_DIR}_backup_$(date +%Y%m%d%H%M%S)"
                                            mkdir -p \$backup_dir
                                            cp -r ${DEPLOY_DIR}/* \$backup_dir/ || true
                                            
                                            # 确保目录权限正确
                                            chown -R www-data:www-data ${DEPLOY_DIR}
                                            chmod -R 755 ${DEPLOY_DIR}
                                            
                                            # 可选：重启Nginx
                                            sudo systemctl reload nginx
                                        """
                                    )
                                ]
                            )
                        ]
                    )
                }
            }
        }
    }

    post {
        success {
            // 构建成功通知
            slackSend(color: 'good', message: "VitePress 构建成功: ${env.JOB_NAME} - ${env.BUILD_NUMBER}")
        }
        failure {
            // 构建失败通知
            slackSend(color: 'danger', message: "VitePress 构建失败: ${env.JOB_NAME} - ${env.BUILD_NUMBER}")
        }
    }
}
