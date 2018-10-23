let check = (dados) => {
  let result = {
    success: true,
    message: ''
  }

  if (!dados.batimentos) {
    result.success = false
    return `Dados de batimento do Paciente não disponível`
  }

  if (dados.batimentos < 60) {
    result.success = false
    result.message = `Paciente com bradicardia, valor: ${dados.batimentos}`
  }

  if (dados.batimentos > 100) {
    result.success = false
    result.message = `Paciente com taquicardia, valor: ${dados.batimentos}`
  }

  
  
  if (!dados.pressao) {
    result.success = false
    result.message = `Dados da pressão do Paciente não disponível`
  }

  if (dados.pressao.sistolica > 140 || dados.pressao.diastolica > 90) {
    result.success = false
    result.message = `Paciente com pressão alta, valor: ${dados.pressao.sistolica + '/' + dados.pressao.diastolica}`
  }

  if (dados.pressao.sistolica < 100 || dados.pressao.diastolica < 60) {
    result.success = false
    result.message = `Paciente com pressão baixa, valor: ${dados.pressao.sistolica + '/' + dados.pressao.diastolica}`
  }
  
  if (dados.vo2 >= 16 || dados.vo2 <= 18) {
    result.success = false
    result.message = `Paciente cardiaco gravemente enfermo, valor: ${dados.vo2}`
  }
  
  if (dados.vo2 > 18 || dados.vo2 <= 22) {
    result.success = false
    result.message = `Paciente cardiaco moderadamente enfermo, valor: ${dados.vo2}`
  }
  
  if (dados.vo2 >= 23 || dados.vo2 <= 29) {
    result.success = false
    result.message = `Paciente sedentário com baixa capacidade física, valor: ${dados.vo2}`
  }
  
  if (dados.vo2 >= 30 || dados.vo2 <= 39) {
    result.success = false
    result.message = `Paciente sedentário com média capacidade física, valor: ${dados.vo2}`
  }
  
  if (dados.vo2 >= 40) {
    result.success = false
    result.message = `Paciente ativo e treinado, valor: ${dados.vo2}`
  }
  
  if (dados.vo2 >= 80) {
    result.success = false
    result.message = `Paciente com alto rendimento, atleta de alto nível valor: ${dados.vo2}`
  }

  return result
}

module.exports = check
