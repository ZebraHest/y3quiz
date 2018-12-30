$(document).ready(function() {
  var questionNumber = 0;
  var questionBank = new Array();
  var stage = "#game1";
  var stage2 = new Object;
  var questionLock = false;
  var numberOfQuestions;
  var score = 0;
  var lightAnswers = ["et maskindrevet skib","et maskindrevet skib, der slæber","et maskindrevet skib, der slæber, og slæbet er over 200 m","et sejlskib","beskæftiget med trawlfiskeri","beskæftiget med fiskeri, bortset fra trawlfiskeri","ikke under kommando","begrænset i sin manøvreevne","hæmmet af sin dybgang","beskæftiget med lodstjeneste","en ankerligger","stødt på grund","beskæftiget med minerydning","beskæftiget med uddybningsarbejde","let","gør fart gennem vandet","under 50 m i længde","set mod dets styrbords side","set mod dets bagbords side","set ret for fra","set agter fra"];
  var fogSoundAnswers = ["-", "--", "-..", "-...", "..-", "....","Klokke, 5 sek", "Klokke 5 sek + gongong 5 sek"];
  var fogPeriodAnswers = ["1 min", "2 min"];

  var test = [true, 2, "hest"];

  $.getJSON('lightQuestion.json', function(data) {
    for(i=0; i < data.list.length; i++){
      questionBank.push(data.list[i]);
    }
    shuffle(questionBank);
    numberOfQuestions = questionBank.length;
  //  displayLightQuestion();
  })//getJSON

  $.getJSON('fogQuestion.json', function(data) {
    var length = questionBank.length;
    for(i=0; i < data.list.length; i++){
      questionBank.push(data.list[i]);
    }
    shuffle(questionBank);
    numberOfQuestions = questionBank.length;
    displayQuestion();
  })//getJSON

  function displayQuestion(){
    var question = questionBank[questionNumber];
    if(question.type == "light"){
      displayLightQuestion(question);
    }else if (question.type == "fog") {
      displayFogQuestion(question);
    }
  }

  function displayAnswer(correct, answers){
    window.scrollTo(0,0);
    var stringCorrect = "Forkert";
    if (correct) {
      stringCorrect = "Korrekt";
      score++;
    }
    $(stage).append('<div class = "questionText">' +stringCorrect+ " "+score+"/"+(questionNumber+1)+'</div>')

    var question = questionBank[questionNumber];
    if(question.type == "light"){
      displayLightAnswer(question, correct, answers);
    }else if (question.type == "fog") {
      displayFogAnswer(question, correct, answers);
    }
  }

  function changeQuestion(){
    questionNumber++;

    if(stage == "#game1"){
      stage2 = "#game1";
      stage = "#game2";
    }else{
      stage2 = "#game2";
      stage = "#game1";
    }
    if(questionNumber < numberOfQuestions){
      displayQuestion();
    }else{
      displayFinalSlide();
    }

    $(stage2).animate({"right":"+=800px"} , "slow", function() {
      $(stage2).css('right' , '-800px');
      $(stage2).empty();
    })
    $(stage).animate({"right":"+=800px"} , "slow", function(){questionLock = false;});
  }

  function submitFunction(correct, answers){
    if(stage == "#game1"){
      stage2 = "#game1";
      stage = "#game2";
    }else{
      stage2 = "#game2";
      stage = "#game1";
    }
    displayAnswer(correct, answers);

    $(stage2).animate({"right":"+=800px"} , "slow", function() {
      $(stage2).css('right' , '-800px');
      $(stage2).empty();
    })
    $(stage).animate({"right":"+=800px"} , "slow", function(){questionLock = false;});
  }

  function displayFinalSlide(){

    $(stage).append('<div class="questionText">You have finished the quiz!<br><br>Total questions: '+numberOfQuestions+'<br>Correct answers: '+score+'</div>');

  }

  /*
  *     LIGHT QUESTION
  */

  function displayLightQuestion(question){
    window.scrollTo(0,0);

    $(stage).append('<div class = "questionText">' + "Marker med kryds, hvilke oplysninger de viste lys eller signalfigurer giver dig om skibet på figuren"+'</div>')

    var pic = question.picture;
    $(stage).append('<div id= "pix" class = "pix"><img class="sticky" src="img/lanterner/'+pic+'"></div>')

    for(i=0 ; i<lightAnswers.length; i++){
      $(stage).append('<label class="container">'+lightAnswers[i]+'<input type="checkbox" id = "lightAnswer'+i+'"><span class="checkmark"></span></label>');
    }

    $(stage).append('<div class = "submit"> Svar </div>');

    $('.submit').click(function(){
      var correctAnswers = true;
      var answers = new Array;
      for(i=0 ; i<lightAnswers.length; i++){
        var test = document.getElementById("lightAnswer"+i).checked;
        answers[i] = test;
        if (question.answerList[i] !== test) {
          correctAnswers = false;
        }
      }
      submitFunction(correctAnswers, answers)
    });
  }

  function displayLightAnswer(question, correct, answers){
    var pic = question.picture;
    $(stage).append('<div id= "pix" class = "pix"><img  class="sticky" src="img/lanterner/'+pic+'"></div>')

    $(stage).append('<div class = "questionText">' +"Svar:"+'</div>')
    $(stage).append('<div class = "answerText">' +question.description+'</div>')

    if (!correct) {
      $(stage).append('<div class = "questionText">' +"Du svarede:"+'</div>')
      var answerString = "";
      var first = true;
      for(i=0 ; i<lightAnswers.length; i++){
        if (answers[i]) {
          if (!first) {
            answerString += ", ";
          }
          first = false;
          answerString += lightAnswers[i];
        }
      }
      $(stage).append('<div class = "answerText">' +answerString+'</div>')
    }

    $(stage).append('<div class = "submit">Næste</div>');

    $('.submit').click(function(){
      changeQuestion()
    });
  }

  /*
  *     FOG QUESTION
  */

  function displayFogQuestion(question){
    window.scrollTo(0,0);

    $(stage).append('<div class = "questionText">' + "Angiv ved afkrydsning, hvilket tågesignal det skal afgive i tilfælde af nedsat sigt.<br> Angiv endvidere med hvilket mellemrum tågesignalet højst må afgives. "+'</div>')

    $(stage).append('<div class = "spacer"></div>')

    $(stage).append('<div class = "answerText">' + question.description +'</div>')

    $(stage).append('<div class = "smallQuestionText">' + "Signal:" +'</div>')

    for(i=0 ; i<fogSoundAnswers.length; i++){
      $(stage).append('<label class="container">'+fogSoundAnswers[i]+'<input type="checkbox" id = "soundAnswer'+i+'"><span class="checkmark"></span></label>');
    }

    $(stage).append('<div class = "smallQuestionText">' + "Højest mellemrum:" +'</div>')

    for(i=0 ; i<fogPeriodAnswers.length; i++){
      $(stage).append('<label class="container">'+fogPeriodAnswers[i]+'<input type="checkbox" id = "periodAnswer'+i+'"><span class="checkmark"></span></label>');
    }

    $(stage).append('<div class = "submit"> Svar </div>');

    $('.submit').click(function(){
      var correctAnswers = true;
      var answers = new Array;
      var soundArray = new Array;
      var periodArray = new Array;
      for(i=0 ; i<fogSoundAnswers.length; i++){
        var test = document.getElementById("soundAnswer"+i).checked;
        soundArray[i] = test;
        if (question.sound[i] !== test) {
          correctAnswers = false;
        }
      }
      for(i=0 ; i<fogPeriodAnswers.length; i++){
        var test = document.getElementById("periodAnswer"+i).checked;
        periodArray[i] = test;
        if (question.period[i] !== test) {
          correctAnswers = false;
        }
      }

      answers[0] = soundArray;
      answers[1] = periodArray;
      submitFunction(correctAnswers, answers)
    });
  }

  function displayFogAnswer(question, correct, answers){

    $(stage).append('<div class = "answerText">' +question.description+'</div>')
    $(stage).append('<div class = "questionText">' +"Svar:"+'</div>')

    var answerCorrect = "";
    for(i=0 ; i<fogSoundAnswers.length; i++){
      if (question.sound[i]) {
        answerCorrect += fogSoundAnswers[i];
      }
    }
    for(i=0 ; i<fogPeriodAnswers.length; i++){
      if (question.period[i]) {
        answerCorrect += " med højest ";
        answerCorrect += fogPeriodAnswers[i];
        answerCorrect += " mellemrum";
      }
    }
    $(stage).append('<div class = "answerText">' +answerCorrect+'</div>')

    if (!correct) {
      $(stage).append('<div class = "questionText">' +"Du svarede:"+'</div>')
      var answerString = "";
      for(i=0 ; i<fogSoundAnswers.length; i++){
        if (answers[0][i]) {
          answerString += fogSoundAnswers[i];
        }
      }
      for(i=0 ; i<fogPeriodAnswers.length; i++){
        if (answers[1][i]) {
          answerString += " med højest ";
          answerString += fogPeriodAnswers[i];
          answerString += " mellemrum";
        }
      }
      $(stage).append('<div class = "answerText">' +answerString+'</div>')
    }

    $(stage).append('<div class = "submit">Næste</div>');

    $('.submit').click(function(){
      changeQuestion()
    });
  }

  /*
  *       GENERAL STUFF
  */

  function shuffle(a) {
      for (let i = a.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
  }


});
