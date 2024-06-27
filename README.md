# Cadastro de carro

**RF**

Deve ser possível cadastrar um novo carro.

**RN**

Não deve ser possivel cadastrar dois carros com a mesma placa.
O carro deve ser cadastrado como disponível por padrão.
* Somente o admninistrador pode cadastrar um carro.

# Listagem de carros

**RF**

Deve ser possível listar todos os carros disponíveis.

**RN**

O usuário não precisa estar logado para listar os carros.

# Cadastro de especificação no carro

**RF**

Deve ser possível cadastrar uma especificação para um carro.
Deve ser possivel listar todas as especificações.
Deve ser possivel listar todos os carros

**RN**

Não deve ser possível cadastrar uma espeficificação para um carro que não existe.
Não deve ser possível cadastrar uma mesma especificação ja existente para o mesmo carro.
Somente o admninistrador pode cadastrar uma especificação.


# Cadastro de Imagens do carro

**RF**
Deve ser possível cadastrar n imagens para um carro.

**RNF**
Utilizar o multer para upload dos arquivos.

**RN**

Um usuario  pode cadastrar mais de uma imagem para um carro
O usuario responsavel pelo cadastro de imagem deve ser um administrador.

# Aluguel de carro

**RF**
Deve ser possivel cadastrar um aluguel (rental) de um carro.

**RN**

O aluguel deve ter duração minima de 24 hrs.
Não  deve ser possível cadastrar um novo aluguel caso ja exista um aberto para o mesmo usuario.
Não  deve ser possivel cadastrar um aluguel que ja exista aberto para o mesmo carro.
