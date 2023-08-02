const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
      preload: preload,
      create: create,
      update: update
    }
  };
  
  const game = new Phaser.Game(config);
  
  let spaceship;
  let asteroids;
  let stars;
  let score = 0;
  let scoreText;
  
  function preload() {
    this.load.image('spaceship', 'spaceship.png');
    this.load.image('asteroid', 'asteroid.png');
    this.load.image('star', 'star.png');
  }
  
  function create() {
    // Create spaceship
    spaceship = this.add.sprite(config.width / 2, config.height / 2, 'spaceship');
    spaceship.setOrigin(0.5);
  
    // Enable input for the spaceship to respond to mouse movements
    this.input.on('pointermove', (pointer) => {
      spaceship.x = pointer.x;
      spaceship.y = pointer.y;
    });
  
    // Create groups for asteroids and stars
    asteroids = this.physics.add.group();
    stars = this.physics.add.group();
  
    // Create asteroids and stars at regular intervals
    this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        createAsteroid();
        createStar();
      }
    });
  
    // Set up collisions
    this.physics.add.collider(spaceship, asteroids, onCollision, null, this);
    this.physics.add.overlap(spaceship, stars, onStarCollected, null, this);
  
    // Display score
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });
  }
  
  function update() {
    // Move asteroids and stars downwards
    asteroids.getChildren().forEach((asteroid) => {
      asteroid.y += 5;
    });
  
    stars.getChildren().forEach((star) => {
      star.y += 5;
    });
  
    // Remove objects that are out of the screen
    asteroids.getChildren().forEach((asteroid) => {
      if (asteroid.y > config.height) {
        asteroid.destroy();
      }
    });
  
    stars.getChildren().forEach((star) => {
      if (star.y > config.height) {
        star.destroy();
      }
    });
  }
  
  function createAsteroid() {
    const x = Phaser.Math.Between(0, config.width);
    const asteroid = asteroids.create(x, -50, 'asteroid');
    asteroid.setOrigin(0.5);
  }
  
  function createStar() {
    const x = Phaser.Math.Between(0, config.width);
    const star = stars.create(x, -50, 'star');
    star.setOrigin(0.5);
  }
  
  function onCollision() {
    score -= 1;
    scoreText.setText(`Score: ${score}`);
  }
  
  function onStarCollected(spaceship, star) {
    star.destroy();
    score += 1;
    scoreText.setText(`Score: ${score}`);
  }