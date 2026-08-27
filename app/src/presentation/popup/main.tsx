import { render } from 'preact';
import '../../index.css';
import { PopupApp } from './PopupApp';

/** Monta la aplicación popup. */
render(<PopupApp />, document.getElementById('app')!);