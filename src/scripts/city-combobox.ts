/**
 * Behaviour for CityCombobox.astro: open/close, live filtering, keyboard
 * navigation (arrows, Enter, Escape) and click-outside dismissal.
 */
export interface CityComboboxOptions {
  onCity: (slug: string, name: string) => void;
  /** Called when "Use my current location" is chosen; omit when GPS is hidden. */
  onGps?: () => void;
}

export interface CityComboboxHandle {
  /** Replaces the trigger text, e.g. with the chosen city or "Near Lucknow". */
  setLabel: (label: string) => void;
  /** Marks a city as selected, or clears the mark with null (GPS location). */
  select: (slug: string | null) => void;
  close: () => void;
}

export function initCityCombobox(
  root: HTMLElement,
  options: CityComboboxOptions,
): CityComboboxHandle {
  const trigger = root.querySelector<HTMLButtonElement>('[data-cc-trigger]');
  const label = root.querySelector<HTMLElement>('[data-cc-label]');
  const panel = root.querySelector<HTMLElement>('[data-cc-panel]');
  const input = root.querySelector<HTMLInputElement>('[data-cc-search]');
  const list = root.querySelector<HTMLElement>('[data-cc-list]');
  const empty = root.querySelector<HTMLElement>('[data-cc-empty]');
  const gps = root.querySelector<HTMLButtonElement>('[data-cc-gps]');

  if (!trigger || !label || !panel || !input || !list || !empty) {
    throw new Error('City combobox markup is incomplete.');
  }

  const items = Array.from(list.querySelectorAll<HTMLElement>('li[role="option"]'));
  let visible: HTMLElement[] = items;
  let activeIndex = -1;

  function setActive(index: number) {
    activeIndex = index;
    visible.forEach((item, i) => item.classList.toggle('is-active', i === index));

    const active = visible[index];
    if (active) {
      input!.setAttribute('aria-activedescendant', active.id);
      active.scrollIntoView({ block: 'nearest' });
    } else {
      input!.removeAttribute('aria-activedescendant');
    }
  }

  function filter(query: string) {
    const tokens = query.toLowerCase().trim().split(/\s+/).filter(Boolean);

    for (const item of items) {
      const haystack = item.dataset.search ?? '';
      item.hidden = !tokens.every((token) => haystack.includes(token));
    }

    visible = items.filter((item) => !item.hidden);
    empty!.hidden = visible.length > 0;
    setActive(visible.length > 0 ? 0 : -1);
  }

  function open() {
    panel!.hidden = false;
    trigger!.setAttribute('aria-expanded', 'true');
    input!.value = '';
    filter('');

    const selectedIndex = visible.findIndex((item) => item.getAttribute('aria-selected') === 'true');
    if (selectedIndex >= 0) setActive(selectedIndex);
    input!.focus();
  }

  function close(returnFocus = false) {
    if (panel!.hidden) return;
    panel!.hidden = true;
    trigger!.setAttribute('aria-expanded', 'false');
    if (returnFocus) trigger!.focus();
  }

  function choose(item: HTMLElement | undefined) {
    if (!item?.dataset.slug) return;
    options.onCity(item.dataset.slug, item.dataset.name ?? item.dataset.slug);
    close(true);
  }

  function move(step: number) {
    if (visible.length === 0) return;
    setActive((activeIndex + step + visible.length) % visible.length);
  }

  trigger.addEventListener('click', () => (panel.hidden ? open() : close(true)));

  trigger.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown' && panel.hidden) {
      event.preventDefault();
      open();
    }
  });

  input.addEventListener('input', () => filter(input.value));

  input.addEventListener('keydown', (event) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        move(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        move(-1);
        break;
      case 'Enter':
        event.preventDefault();
        choose(visible[activeIndex]);
        break;
      case 'Escape':
        event.preventDefault();
        close(true);
        break;
      case 'Tab':
        close(false);
        break;
    }
  });

  list.addEventListener('click', (event) => {
    choose((event.target as HTMLElement).closest<HTMLElement>('li[role="option"]') ?? undefined);
  });

  gps?.addEventListener('click', () => {
    close(false);
    options.onGps?.();
  });

  document.addEventListener('click', (event) => {
    if (!root.contains(event.target as Node)) close(false);
  });

  return {
    setLabel: (text) => {
      label.textContent = text;
    },
    select: (slug) => {
      for (const item of items) {
        item.setAttribute('aria-selected', String(item.dataset.slug === slug));
      }
    },
    close: () => close(false),
  };
}
