const fetchpokemon = async (id) => {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await res.json();
    console.log(data);
}

fetchpokemon(2);