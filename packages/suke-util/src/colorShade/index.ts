/**
 * Source: https://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
 */
export const colorShade = (col: string, amt: number): string => {
    col = col.replace(/^#/, '');
    if (col.length === 3) col = col[0] + col[0] + col[1] + col[1] + col[2] + col[2];
  
    const matches = col.match(/.{2}/g);
    if (matches == null)
        return col;
    
    let [r, g, b] = matches;
    const [rn, gn, bn] = [parseInt(r, 16) + amt, parseInt(g, 16) + amt, parseInt(b, 16) + amt];
  
    r = Math.max(Math.min(255, rn), 0).toString(16);
    g = Math.max(Math.min(255, gn), 0).toString(16);
    b = Math.max(Math.min(255, bn), 0).toString(16);
  
    const rr = (r.length < 2 ? '0' : '') + r;
    const gg = (g.length < 2 ? '0' : '') + g;
    const bb = (b.length < 2 ? '0' : '') + b;
  
    return `#${rr}${gg}${bb}`;
};