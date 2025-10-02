// Navbar blur effect on scroll
function handleNavbarScroll() {
    const navbar = document.querySelector('nav');
    const scrollThreshold = 10; // Adjust this value to change when the blur effect kicks in
    
    function updateNavbar() {
        if (window.scrollY > scrollThreshold) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    // Initial check
    updateNavbar();
    
    // Add scroll event listener with throttling for better performance
    let ticking = false;
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', () => {
        requestTick();
        ticking = false;
    });
}

document.addEventListener('DOMContentLoaded', handleNavbarScroll);
