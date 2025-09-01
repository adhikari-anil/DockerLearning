# P2P File Sharing App (still in development phase)

A peer-to-peer file sharing application built with Docker containerization for easy deployment and scalability.

## Features

- Peer-to-peer file sharing
- Containerized deployment
- Easy setup and configuration

## Prerequisites

Before running this application, make sure you have the following installed:

- [Docker](https://docs.docker.com/get-docker/) (version 20.10 or higher)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 2.0 or higher)

## Quick Start

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd p2p
```
### Open docker desktop before doing any futhur setup processess.

### 2. Environment Configuration

Create a `.env` file in the root directory of the project.

```bash
touch ./.env
```

Edit the `.env` file with your configuration:

```env
# Backend
PORT=5000    //make sure 5000 is available
NODE_ENV=production
SOCKET_PATH=/socket.io

# Frontend
VITE_SOCKET_URL=/
```

### 3. Build and Run

Build and start the application using Docker Compose:

```bash
docker-compose up --build
```

For running in detached mode (background):

```bash
docker-compose up --build -d
```
### Note: Once container is built then no need to build it for running container purpose.(If code is update then you can built it again)

### 4. Access the Application

Once the containers are running, you can access the application at:
1. Using docker desktop:
   - In docker desktop and navigate to container.
   - There is ports column where you can find direct navigate link.
2. Web Interface: `http://localhost`

## Docker Services

The application consists of the following services:

- **backend**: Main P2P application server
- **frontend**: Main P2P application frontend
  
## Usage

### Starting the Application

```bash
# Start all services
docker-compose up --build
```

### Stopping the Application

```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Stop and remove everything including images
docker-compose down --rmi all -v
```

## Development

### Rebuilding After Changes

```bash
# Rebuild and restart
docker-compose up --build

# Rebuild specific service
docker-compose build app
docker-compose up app
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   Error: bind: address already in use
   ```
   - Change the port in `.env` file or stop the conflicting service

2. **Permission Denied**
   ```bash
   Error: permission denied
   ```
   - Ensure Docker daemon is running
   - Check file permissions in the project directory

## File Structure

```p2p/
├── backend/
├── instantShare/
├── nginx/
├── .gitignore
├── docker-compose.yml
└── .env (created by above command in bash)
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with Docker: `docker-compose up --build`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

- Review Docker and Docker Compose documentation
