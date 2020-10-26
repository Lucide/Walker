# Walkers

*it's a long way to Tipperary*

<p align="center">
  <img src="assets/gameplay.gif">
</p>

## What's this?

Who knows? I thought that the path passing through the rightmost intersection of two moving circles could resemble a leg.\
I started experimenting with canvas and [PIXI.js](https://www.pixijs.com/), and after scribbling on sheets and sheets of paper and revising a lot of math, this thing came out.\
It's my second web-related project ever, written in Typescript when I was 18.

The feet's horizontal movement follows a triangle wave (imagine it scrolling vertically), the vertical movement is described by a sine wave (scrolling horizontally).

The marks on the ground represent a stored height value. At any point, the terrain height is calculated by interpolating the surrounding heights.

The hips follow a simple springy routine.

## [Try it](https://lucide.github.io/Walkers/)

## Features

* math scattered in every corner
* lots of legs
* PIXI library included for no reason

## Curator

* repo refactored to separate better between sources and compiled files
* unused files removed
* improved typescript handling. The types definition used here look like old style ambient declarations
