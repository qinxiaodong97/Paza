const questions = document.querySelectorAll('[data-question]');
questions.forEach((question) => {
  question.addEventListener('click', () => {
    
   console.log(question);

    if(question.querySelector('.faqs__question').classList.contains('active')){
      questions.forEach((question)=>{
        question.querySelector('[data-answer]').classList.remove('active');
        question.querySelector('.faqs__question').classList.remove('active');
      });
    }else{
      console.log(2);
      questions.forEach((question)=>{
        question.querySelector('[data-answer]').classList.remove('active');
        question.querySelector('.faqs__question').classList.remove('active');
      });
      const answer = question.querySelector('[data-answer]');
      question.querySelector('.faqs__question').classList.toggle('active');
      answer.classList.toggle('active');
    }
    
  });
});
