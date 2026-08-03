import { render } from 'preact';
import '../../index.css';
import { DashboardApp } from './DashboardApp';

/** Monta la aplicación del dashboard / new tab. */
render(<DashboardApp />, document.getElementById('app')!);