<template>
  <div class="home-container">
    <header class="header">
      <h1>Event Manager</h1>
      <p>Your ultimate event management tool</p>
      <nav class="nav-menu">
        <router-link to="/events" class="nav-item">View Events</router-link>
        <router-link to="/add-event" class="nav-item"
          >Add New Event</router-link
        >
      </nav>
    </header>

    <section class="main-content">
      <div class="card-container">
        <div class="card">
          <h2>Upcoming Events</h2>
          <p>
            See what's coming up next and never miss out on your favorite
            events.
          </p>
          <router-link to="/events" class="card-link"
            >Explore Events</router-link
          >
        </div>

        <div class="card">
          <h2>Event Planning</h2>
          <p>
            Plan and organize your own events with ease using our intuitive
            tools.
          </p>
          <router-link to="/add-event" class="card-link"
            >Start Planning</router-link
          >
        </div>

        <div class="card">
          <h2>Event Insights</h2>
          <p>
            Analyze and get insights on past events to make informed decisions
            for future ones.
          </p>
          <router-link to="#" class="card-link">View Insights</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-container {
  display: grid;
  grid-template-rows: auto 1fr;
  min-height: 100vh;
  font-family: "Arial", sans-serif;
  color: #333;
}

.header {
  background: #007bff;
  color: white;
  padding: 20px;
  text-align: center;
}

.header h1 {
  margin: 0;
  font-size: 2.5rem;
}

.header p {
  margin: 10px 0;
  font-size: 1.2rem;
}

.nav-menu {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 10px;
}

.nav-item {
  color: white;
  text-decoration: none;
  background: #0056b3;
  padding: 10px 20px;
  border-radius: 5px;
  transition: background 0.3s;
}

.nav-item:hover {
  background: #004494;
}

.main-content {
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.card-container {
  display: grid;
  gap: 20px;
}

.card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.card h2 {
  margin-top: 0;
  font-size: 1.5rem;
}

.card p {
  font-size: 1rem;
}

.card-link {
  display: inline-block;
  margin-top: 10px;
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s;
}

.card-link:hover {
  color: #0056b3;
}
</style>
