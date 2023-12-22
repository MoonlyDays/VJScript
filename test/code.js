function degrees_to_radians(degrees) {
    const pi = Math.PI;
    return degrees * (pi / 180);
}

for (let i = 0; i < 360; i++) {

    const rad = degrees_to_radians(i);
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    console.log(`Deg: ${i}°: sin: ${sin}, cos: ${cos}`);
}