$(document).ready(function() {
    $('.question-btn').click(function() {
      $(this).next('.answer').slideToggle();
      $(this).toggleClass('active');
    });
});

  