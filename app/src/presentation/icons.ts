/**
 * Iconos de la UI (paquete reicon-react).
 *
 * Re-export centralizado de los iconos que usa la interfaz, importados desde
 * los subpaths del paquete (`reicon-react/icons/NombreIcono`) para que cada
 * bundle (dashboard, popup y content script) incluya solo los iconos que
 * necesita (tree-shaking por ruta, no desde el barrel completo).
 */

import BookOpen from 'reicon-react/icons/BookOpen';
import Bookmark from 'reicon-react/icons/Bookmark';
import Loader from 'reicon-react/icons/Loader';
import Check from 'reicon-react/icons/Check';
import X from 'reicon-react/icons/X';
import AlertCircle from 'reicon-react/icons/AlertCircle';
import Undo from 'reicon-react/icons/Undo';
import Trash from 'reicon-react/icons/Trash';
import Inbox from 'reicon-react/icons/Inbox';
import Archive from 'reicon-react/icons/Archive';
import ChevronRight from 'reicon-react/icons/ChevronRight';
import ArrowLeft from 'reicon-react/icons/ArrowLeft';
import ArrowRight from 'reicon-react/icons/ArrowRight';
import SidebarLeft from 'reicon-react/icons/SidebarLeft';
import Menu2 from 'reicon-react/icons/Menu2';

export {
  BookOpen,
  Bookmark,
  Loader,
  Check,
  X,
  AlertCircle,
  Undo,
  Trash,
  Inbox,
  Archive,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  SidebarLeft,
  Menu2,
};
