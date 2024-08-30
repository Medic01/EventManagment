<template>
  <header>
    <nav>
      <ul>
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/events">Events</router-link></li>
        <li><router-link to="/add-event">Add Event</router-link></li>
      </ul>
    </nav>
  </header>
</template>

<style>
header {
  background-color: #333;
  color: #fff;
  padding: 1rem;
}
nav ul {
  list-style: none;
  padding: 0;
}
nav ul li {
  display: inline;
  margin-right: 1rem;
}
nav ul li a {
  color: #fff;
  text-decoration: none;
}
</style>
