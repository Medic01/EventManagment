<template>
  <header>
    <div class="header-content">
      <h1>Find anything you want</h1>
      <p>Music, Art, Food & Drink, Hobbies, Nightlife</p>
    </div>
  </header>
</template>

<style scoped>
header {
  background-color: #222;
  color: #fff;
  padding: 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.header-content h1 {
  font-size: 2.5rem;
  margin: 0;
  font-weight: bold;
}

.header-content p {
  font-size: 1.5rem;
  margin: 0.5rem 0 0;
  font-style: italic;
  color: #ddd;
}

header:before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #ff4b2b, #ff416c);
  z-index: -1;
  opacity: 0.85;
  clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%);
}

header {
  position: relative;
  overflow: hidden;
}
</style>
