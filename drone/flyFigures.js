
function flySquare() {
  client
    .after(5000, function() {
      this.up(0.5);
    })
    .after(2000, function() {
      this.stop();
    })
    .after(1000, function() {
      this.front(0.2);
    })
    .after(1500, function() {
      this.stop();
    })
    .after(1000, function() {
      this.left(0.2);
    })
    .after(1500, function() {
      this.stop();
    })
    .after(1000, function() {
      this.back(0.2);
    })
    .after(1500, function() {
      this.stop();
    })
    .after(1000, function() {
      this.right(0.2);
    })
    .after(1500, function() {
      this.stop();
    })
    .after(3000, function() {
      this.stop();
      this.land();
    });
}
