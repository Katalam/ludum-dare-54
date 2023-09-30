import { Circle, Point, Rectangle } from "pixi.js"

type Collider = Point | Circle | Rectangle

export function colliding(a: Collider, b: Collider): boolean {
    // point
    if (a instanceof Point && b instanceof Point) {
        return point_point_collision(a, b);
    } else if (a instanceof Point && b instanceof Circle) {
        return point_circle_collision(a, b);
    } else if (a instanceof Point && b instanceof Rectangle) {
        return point_rectangle_collision(a, b);
    }
    // circle
    if (a instanceof Circle && b instanceof Point) {
        return point_circle_collision(b, a);
    } else if (a instanceof Circle && b instanceof Circle) {
        return circle_circle_collision(a, b);
    } else if (a instanceof Circle && b instanceof Rectangle) {
        return circle_rectangle_collision(a, b);
    }
    // rectangle
    if (a instanceof Rectangle && b instanceof Point) {
        return point_rectangle_collision(b, a);
    } else if (a instanceof Rectangle && b instanceof Circle) {
        return circle_rectangle_collision(b, a);
    } else if (a instanceof Rectangle && b instanceof Rectangle) {
        return rectangle_rectangle_collision(a, b);
    }

    return false;
}

export function point_point_collision(a: Point, b: Point): boolean {
    return a.x == b.x && a.y == b.y;
}

export function point_circle_collision(a: Point, b: Circle): boolean {
    return b.contains(a.x, a.y);
}

export function point_rectangle_collision(a: Point, b: Rectangle) {
    return b.contains(a.x, a.y);
}

export function circle_circle_collision(a: Circle, b: Circle): boolean {
    if (a.radius <= 0 || b.radius <= 0) {
        return false;
    }

    return (a.x - b.x) ** 2 + (a.y - b.y) ** 2 <= (a.radius + b.radius) ** 2
}

export function circle_rectangle_collision(a: Circle, b: Rectangle): boolean {
    if (a.radius <= 0 || b.width <= 0 || b.height <= 0) {
        return false;
    }

    if (a.x + a.radius < b.x // left of rect
        || a.x - a.radius > b.x + b.width // right of rect
        || a.y + a.radius < b.y // above rect
        || a.y - a.radius > b.y + b.height) { // below rect
        return false;
    }

    const distanceX = Math.max(Math.abs(a.x - b.x - b.width / 2) - b.width / 2, 0);
    const distanceY = Math.max(Math.abs(a.y - b.y - b.height / 2) - b.height / 2, 0);

    return distanceX ** 2 + distanceY ** 2 <= a.radius ** 2
}

export function rectangle_rectangle_collision(a: Rectangle, b: Rectangle): boolean {
    return a.intersects(b);
}
