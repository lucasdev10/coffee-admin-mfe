import { TestBed, ComponentFixture } from '@angular/core/testing';
import { App } from './app';
import { signal } from '@angular/core';

describe('App', () => {
  it('should have title signal', () => {
    const app = new App();
    expect(app['title']()).toBe('coffee-admin-mfe');
  });

  it('should be able to create title signal', () => {
    const mySignal = signal('coffee-admin-mfe');
    expect(mySignal()).toBe('coffee-admin-mfe');
  });
});
