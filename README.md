# Bank Lab - Prog I

Este repositório contém o código do projeto **Bank_LabProgI**, desenvolvido usando as seguintes tecnologias:

## **Stacks Utilizadas**

* **NestJS**:
* **TypeScript**
* **Docker**
* **Kubernetes**
* **Minikube / Docker Desktop**

## **Como Rodar**

### **Rodando Localmente com Docker**

1. **Clone o repositório**:

   ```bash
   git clone https://github.com/DJeanS03/bank_labProgI.git
   cd bank_lab-prog-i
   ```

2. **Construir a Imagem Docker**:

   ```bash
   docker build -t bank_lab-prog-i:1.0 .
   ```

3. **Rodar o Container**:

   ```bash
   docker run --rm -p 3000:3000 bank_lab-prog-i:1.0
   ```

4. **Acessar a Aplicação**:

   * Abra o navegador e acesse: `http://localhost:3000`

### **Rodando no Kubernetes (Minikube ou Docker Desktop)**

1. **Aplique os Manifests**:

   ```bash
   kubectl apply -f k8s/deployment.yaml
   kubectl apply -f k8s/service.yaml
   ```

2. **Acesse o Serviço**:

   * Usando Minikube:

     ```bash
     minikube service bank-lab-prog-i-service --url
     ```

   * Usando NodePort: Acesse via `http://localhost:30080`.

## **Entregas**

### **Entrega 1**

#### **O que foi solicitado:**

* Criar uma aplicação NestJS simples que exibe "Hello World".
* Dockerizar a aplicação.
* Rodar a aplicação no Kubernetes (Minikube ou Docker Desktop).

#### **O que foi feito:**

* **Criação do Projeto NestJS**: Estrutura básica da aplicação com a rota `/` retornando "Hello World".
* **Dockerização**: A aplicação foi empacotada em um container Docker com `Dockerfile` e `.dockerignore`.
* **Kubernetes**: Configuração do **Deployment** e **Service** para rodar a aplicação em Kubernetes localmente.

#### **Como foi feito:**

* **Docker**: Utilizei um `Dockerfile` para construir a imagem e um `.dockerignore` para excluir arquivos desnecessários.
* **Kubernetes**: Criei os arquivos de manifestos (`deployment.yaml` e `service.yaml`) para orquestrar a aplicação dentro do cluster Kubernetes. Utilizei o **Minikube** para rodar localmente.

---

### **Próximas Entregas**

### **Entrega 2**

### **Entrega 3**



