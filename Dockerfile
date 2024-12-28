FROM node:18

# 작업 디렉토리 설정
WORKDIR /app

# 타임존 설정을 위한 패키지 설치
RUN apt-get update && apt-get install -y tzdata && \
    ln -sf /usr/share/zoneinfo/Asia/Seoul /etc/localtime && \
    echo "Asia/Seoul" > /etc/timezone

# 소스 코드 이전에 종속성 설치
COPY package.json ./
RUN npm install

# 소스 코드 복사
COPY . .

# 환경 변수 설정 및 포트 노출
ENV PORT=3000
EXPOSE $PORT

# 애플리케이션 실행
CMD ["node", "index.js"]
