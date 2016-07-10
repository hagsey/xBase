$(function() {
  var library;

  var library_item = Handlebars.compile($("#library_item").html()),
      library_item_list = Handlebars.compile($("#library_item_list").html());

  Handlebars.registerPartial("library_item", $("#library_item").html());

    library = {
      last_id: function() {
        var last_item = this.collection[this.collection.length - 1];

        if (last_item === undefined) {
          return 0;
        } else {
          return last_item.id;
        };
      },
      collection: [],
      cacheTemplate: function() {
      },
      showAddExerciseModal: function(e) {
        e.preventDefault();
        var $e = $(this),
            $modal = $("#new_exercise_modal"),
            $modal_layer = $("#new_exercise_modal_layer");

        $("#exercise_name").val("");

        $modal.css({
          top: $(window).scrollTop() + 30
        });

        $modal.fadeIn(400);
        $modal_layer.fadeIn(400);

        $(".modal_layer, a.close").on("click", function(e) {
          e.preventDefault();
          $(".modal_layer, .modal").filter(":visible").fadeOut(400);
        });
      },
      addToCollection: function(e) {
        e.preventDefault();

        var new_id = this.last_id() + 1;

        var name = $("#exercise_name").val(),
            exercise = {
              id: new_id,
              likes: 0,
              name: name,
              date: new Date( new Date().toUTCString() ).toLocaleString()
            };

        this.collection.push(exercise);

        $("tbody").find("tr").remove();
        $("tbody").append(library_item_list({ collection: this.collection }));

        $(".modal_layer, .modal").filter(":visible").fadeOut(200);

        this.updateTotal();

      },
      updateTotal: function() {
        $("#total p").text($("#library tbody tr").length);
      },
      updateFeatured: function(e) {
        var $row = $(e.target).closest("tr"),
            name = $row.find("td.exercise").text(),
            date = $row.find("td.date").text();
        $(".featured h3").text(name);
        $(".featured p").text(date);

      },
      clearFeatured: function(e) {
        $(".featured h3").text("");
        $(".featured p").text("");
      },
      removeFromCollection: function(idx) {
        idx = +idx;
        this.collection = this.collection.filter(function(exercise) {
          return exercise.id !== idx;
        });
      },
      removeFromLibrary: function(e) {
        e.preventDefault();

        var $exercise = $(e.target).closest("tr").fadeOut(800).remove();

        this.removeFromCollection($exercise.find("input[type=hidden]").val());

        this.updateTotal();

      },
      likeExercise: function(e) {
        e.preventDefault();
        var $e = $(e.target),
            target_id = (+$e.closest("tr").find("input").val()) - 1,
            current_likes = library.collection[target_id].likes;

        $e.text(current_likes + 1);

        this.collection[target_id].likes = current_likes + 1;
      },
      searchLibrary: function(e) {
        var input = $(e.target).val();
        var $items = $("#library tbody tr");

        $items.each(function() {

          if($(this).find("td.exercise").text().search(new RegExp(input, "i")) < 0) {
          $(this).hide();
        } else {
          $(this).show();
        }
       });
      },
      bindEvents: function() {
        $("#add_exercise_button").on("click", $.proxy(this.showAddExerciseModal, this));
        $("#add_exercise").on("submit", $.proxy(this.addToCollection, this));
        $("#library").on("click", "a.delete", $.proxy(this.removeFromLibrary, this));
        $("#library").on("click", "a.likes", $.proxy(this.likeExercise, this));
        $("tbody").mouseover($.proxy(this.updateFeatured, this));
        $("tbody").mouseout($.proxy(this.clearFeatured, this));
        $("#search").keyup($.proxy(this.searchLibrary, this));
      },
      renderCollection: function() {
        this.collection =  JSON.parse(localStorage.getItem("library")) || [];
        $("tbody").append(library_item_list({ collection: this.collection }));
      },
      init: function() {
        this.cacheTemplate();
        this.bindEvents();
        this.renderCollection();

      }
    };

  library.init();

});