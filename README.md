# Diaz Jupiter Admin Dashboard

```
ssh -i "server.pem" ubuntu@ec2-56-228-42-86.eu-north-1.compute.amazonaws.com
```

```
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo ${UBUNTU_CODENAME}) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```
