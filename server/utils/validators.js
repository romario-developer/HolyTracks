/**
 * Validadores customizados para uso com express-validator
 */

/**
 * Verifica se uma string é uma tonalidade válida
 * @param {string} value - Valor a ser verificado
 * @returns {boolean} - True se for válido, false caso contrário
 */
exports.isValidKey = (value) => {
    const validKeys = [
      'C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 
      'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B',
      'Cm', 'C#m', 'Dbm', 'Dm', 'D#m', 'Ebm', 'Em', 'Fm', 'F#m', 
      'Gbm', 'Gm', 'G#m', 'Abm', 'Am', 'A#m', 'Bbm', 'Bm'
    ];
    
    return validKeys.includes(value);
  };
  
  /**
   * Verifica se uma string é um compasso válido
   * @param {string} value - Valor a ser verificado
   * @returns {boolean} - True se for válido, false caso contrário
   */
  exports.isValidTimeSignature = (value) => {
    const validTimeSignatures = ['4/4', '3/4', '2/4', '6/8', '5/4', '7/8', '12/8'];
    
    return validTimeSignatures.includes(value);
  };
  
  /**
   * Verifica se um valor está dentro de um intervalo
   * @param {number} min - Valor mínimo
   * @param {number} max - Valor máximo
   * @returns {Function} - Função de validação para express-validator
   */
  exports.isInRange = (min, max) => {
    return (value) => {
      const num = parseFloat(value);
      return !isNaN(num) && num >= min && num <= max;
    };
  };
  
  /**
   * Verifica se um valor é um array não vazio
   * @param {Array} value - Valor a ser verificado
   * @returns {boolean} - True se for um array não vazio, false caso contrário
   */
  exports.isNonEmptyArray = (value) => {
    return Array.isArray(value) && value.length > 0;
  };
  
  /**
   * Verifica se uma string é um tempo litúrgico válido
   * @param {string} value - Valor a ser verificado
   * @returns {boolean} - True se for válido, false caso contrário
   */
  exports.isValidLiturgicalTime = (value) => {
    const validTimes = ['comum', 'quaresma', 'pascoa', 'advento', 'natal'];
    
    return validTimes.includes(value.toLowerCase());
  };