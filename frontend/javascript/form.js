let submitButton = document.getElementById('submitButton');

submitButton.addEventListener('click', async () => { 

   Swal.fire({
      title: 'Sucesso',
      text: 'Login no banco efetuado com sucesso!',
      icon: 'success'
  });

   let nomeUsuario = document.getElementsByClassName('user')[0].value;
   let senhaDb = document.getElementsByClassName('senhaDb')[0].value;

   let response = await axios.post('http://localhost:3001/login', {
      nomeUsuario: nomeUsuario,
      senhaDb: senhaDb
   })
   
   console.log(response)
})
