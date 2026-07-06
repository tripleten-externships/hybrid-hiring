import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Meteor } from 'meteor/meteor';
import { useDebounce } from 'use-debounce';
import type {
  AdminUserSummary,
  AdminUserDetails,
} from '/imports/api/admin/userManagement';

const LISTBOX_ID = 'admin-user-listbox';
const optionId = (index: number) => `admin-user-option-${index}`;

function errorReason(err: unknown, fallback: string): string {
  if (err instanceof Meteor.Error) return err.reason || fallback;
  if (err instanceof Error) return err.message || fallback;
  return fallback;
}

function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatPay(profile: AdminUserDetails['profile']): string | null {
  if (!profile?.minPay) return null;
  const unit = profile.payUnit === 'yearly' ? '/yr' : '/hr';
  const amount =
    profile.minPay >= 1000 ? `$${Math.round(profile.minPay / 1000)}K` : `$${profile.minPay}`;
  return `${amount}${unit}`;
}

/** Converts a base64 string to a Blob for viewing/downloading. */
function base64ToBlob(base64: string, contentType: string): Blob {
  const byteChars = atob(base64);
  const bytes = new Uint8Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i += 1) {
    bytes[i] = byteChars.charCodeAt(i);
  }
  return new Blob([bytes], { type: contentType });
}

export function AdminUserManager() {
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 300);
  const [results, setResults] = useState<AdminUserSummary[]>([]);
  const [searching, setSearching] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const [selected, setSelected] = useState<AdminUserDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState<null | 'lock' | 'admin' | 'resume' | 'delete'>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  // Guards against out-of-order search responses overwriting newer results.
  const searchSeq = useRef(0);
  // Name we just committed via selection — used to suppress the re-search that
  // would otherwise fire (and reopen the dropdown) when we set the input value.
  const selectedNameRef = useRef('');

  // ── Search ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const q = debouncedQuery.trim();
    if (q.length < 2 || q === selectedNameRef.current) {
      setResults([]);
      setSearching(false);
      return;
    }

    const seq = ++searchSeq.current;
    setSearching(true);
    Meteor.callAsync('admin.searchUsers', q)
      .then((res: AdminUserSummary[]) => {
        if (seq !== searchSeq.current) return;
        setResults(res);
        setOpen(true);
        setActiveIndex(-1);
      })
      .catch((err: unknown) => {
        if (seq !== searchSeq.current) return;
        setError(errorReason(err, 'Search failed.'));
      })
      .finally(() => {
        if (seq === searchSeq.current) setSearching(false);
      });
  }, [debouncedQuery]);

  // ── Escape closes the delete modal ─────────────────────────────────────────
  useEffect(() => {
    if (!confirmDelete) return;
    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape' && busy !== 'delete') setConfirmDelete(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [confirmDelete, busy]);

  const loadDetails = async (userId: string) => {
    setError('');
    setDetailsLoading(true);
    try {
      const details = (await Meteor.callAsync(
        'admin.getUserDetails',
        userId
      )) as AdminUserDetails;
      setSelected(details);
    } catch (err) {
      setError(errorReason(err, 'Could not load user details.'));
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleSelect = (summary: AdminUserSummary) => {
    selectedNameRef.current = summary.name;
    setQuery(summary.name);
    setResults([]);
    setOpen(false);
    setActiveIndex(-1);
    void loadDetails(summary.userId);
  };

  const handleClear = () => {
    selectedNameRef.current = '';
    setQuery('');
    setResults([]);
    setOpen(false);
    setActiveIndex(-1);
    setSelected(null);
    setError('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!open && results.length > 0) {
        setOpen(true);
        return;
      }
      setActiveIndex((i) => Math.min(results.length - 1, i + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (open) setActiveIndex((i) => Math.max(0, i - 1));
    } else if (e.key === 'Enter') {
      if (open && activeIndex >= 0 && results[activeIndex]) {
        e.preventDefault();
        handleSelect(results[activeIndex]);
      }
    } else if (e.key === 'Tab') {
      // Standard combobox behavior: commit the highlighted option (if any) and
      // let focus move on to the next element.
      if (open && activeIndex >= 0 && results[activeIndex]) {
        handleSelect(results[activeIndex]);
      } else {
        setOpen(false);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
      setActiveIndex(-1);
    }
  };

  const runAction = async (
    action: 'lock' | 'admin' | 'delete',
    fn: () => Promise<unknown>
  ) => {
    setError('');
    setBusy(action);
    try {
      await fn();
      return true;
    } catch (err) {
      setError(errorReason(err, 'Action failed.'));
      return false;
    } finally {
      setBusy(null);
    }
  };

  const handleToggleLock = async () => {
    if (!selected) return;
    const ok = await runAction('lock', () =>
      Meteor.callAsync('admin.setUserLocked', selected.userId, !selected.locked)
    );
    if (ok) void loadDetails(selected.userId);
  };

  const handleToggleAdmin = async () => {
    if (!selected) return;
    const ok = await runAction('admin', () =>
      Meteor.callAsync('admin.setUserAdmin', selected.userId, !selected.isAdmin)
    );
    if (ok) void loadDetails(selected.userId);
  };

  const handleDelete = async () => {
    if (!selected) return;
    const ok = await runAction('delete', () =>
      Meteor.callAsync('admin.deleteUser', selected.userId)
    );
    if (ok) {
      setConfirmDelete(false);
      setSelected(null);
      setQuery('');
    }
  };

  const handleViewResume = async () => {
    if (!selected?.resume) return;
    setError('');
    setBusy('resume');
    try {
      const { contentType, data, fileName } = (await Meteor.callAsync(
        'admin.getUserResume',
        selected.userId
      )) as { fileName: string; contentType: string; data: string };
      const url = URL.createObjectURL(base64ToBlob(data, contentType));
      const opened = window.open(url, '_blank');
      // If the browser blocked the popup (or it's a non-inline type), download instead.
      if (!opened) {
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
      }
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (err) {
      setError(errorReason(err, 'Could not open resume.'));
    } finally {
      setBusy(null);
    }
  };

  const profile = selected?.profile ?? null;
  const locationStr = [profile?.city, profile?.state].filter(Boolean).join(', ');
  const pay = formatPay(profile);

  return (
    <div className="admin-users">
      <div className="admin-users__search-block">
        <label htmlFor="admin-user-search" className="admin-users__label">
          Search for a user
        </label>
        <p className="admin-users__hint" id="admin-user-search-hint">
          Search by email or first / last name, then select a single user.
        </p>
        <div className="admin-users__combo">
          <input
            ref={inputRef}
            id="admin-user-search"
            type="text"
            className="admin-users__search-input"
            role="combobox"
            aria-expanded={open}
            aria-controls={LISTBOX_ID}
            aria-autocomplete="list"
            aria-describedby="admin-user-search-hint"
            aria-activedescendant={activeIndex >= 0 ? optionId(activeIndex) : undefined}
            autoComplete="off"
            placeholder="e.g. jane@example.com or Jane Doe"
            value={query}
            onChange={(e) => {
              selectedNameRef.current = '';
              setQuery(e.target.value);
              setOpen(true);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (results.length > 0) setOpen(true);
            }}
            onBlur={() => {
              // Delay so option onClick can fire before the list unmounts.
              setTimeout(() => setOpen(false), 120);
            }}
          />

          {(query || selected) && (
            <button
              type="button"
              className="admin-users__clear"
              aria-label="Clear search and selected user"
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleClear}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <line
                  x1="3"
                  y1="3"
                  x2="11"
                  y2="11"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                <line
                  x1="11"
                  y1="3"
                  x2="3"
                  y2="11"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}

          {open && (results.length > 0 || (debouncedQuery.trim().length >= 2 && !searching)) && (
            <ul className="admin-users__listbox" id={LISTBOX_ID} role="listbox">
              {results.length === 0 ? (
                <li className="admin-users__option admin-users__option--empty" role="presentation">
                  No users match “{debouncedQuery.trim()}”.
                </li>
              ) : (
                results.map((r, i) => (
                  <li
                    key={r.userId}
                    id={optionId(i)}
                    role="option"
                    aria-selected={i === activeIndex}
                    className={`admin-users__option${i === activeIndex ? ' admin-users__option--active' : ''}`}
                    onMouseDown={(e) => e.preventDefault()}
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => handleSelect(r)}
                  >
                    <span className="admin-users__option-name">
                      {r.name}
                      {r.isAdmin && <span className="admin-users__tag">Admin</span>}
                      {r.locked && (
                        <span className="admin-users__tag admin-users__tag--locked">Locked</span>
                      )}
                    </span>
                    <span className="admin-users__option-email">{r.email}</span>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
        <span className="admin-users__searching" role="status" aria-live="polite">
          {searching ? 'Searching…' : ''}
        </span>
      </div>

      {error && (
        <p className="admin-users__error" role="alert">
          {error}
        </p>
      )}

      {detailsLoading && <p className="admin__loading">Loading user…</p>}

      {selected && !detailsLoading && (
        <section className="admin-users__detail" aria-label={`Details for ${selected.name}`}>
          <header className="admin-users__detail-header">
            <div>
              <h3 className="admin-users__detail-name">
                {selected.name}
                {selected.isAdmin && <span className="admin-users__tag">Admin</span>}
                {selected.locked && (
                  <span className="admin-users__tag admin-users__tag--locked">Locked</span>
                )}
              </h3>
              <p className="admin-users__detail-email">{selected.email}</p>
              <p className="admin-users__detail-meta">Joined {formatDate(selected.createdAt)}</p>
            </div>
            <div className="admin-users__actions">
              <button
                type="button"
                className="admin__toggle-btn"
                onClick={handleToggleAdmin}
                disabled={busy !== null}
              >
                {busy === 'admin'
                  ? 'Saving…'
                  : selected.isAdmin
                    ? 'Remove admin'
                    : 'Make admin'}
              </button>
              <button
                type="button"
                className={`admin__toggle-btn ${selected.locked ? 'admin__toggle-btn--activate' : 'admin__toggle-btn--deactivate'}`}
                onClick={handleToggleLock}
                disabled={busy !== null}
              >
                {busy === 'lock' ? 'Saving…' : selected.locked ? 'Unlock account' : 'Lock account'}
              </button>
              <button
                type="button"
                className="admin__toggle-btn admin__delete-btn"
                onClick={() => setConfirmDelete(true)}
                disabled={busy !== null}
              >
                Delete
              </button>
            </div>
          </header>

          <div className="admin-users__detail-grid">
            {/* Worker profile */}
            <div className="admin-users__panel">
              <h4 className="admin-users__panel-title">Worker Profile</h4>
              {!profile ? (
                <p className="admin-users__panel-empty">No worker profile on file.</p>
              ) : (
                <dl className="admin-users__facts">
                  {locationStr && (
                    <div>
                      <dt>Location</dt>
                      <dd>{locationStr}</dd>
                    </div>
                  )}
                  {profile.phone && (
                    <div>
                      <dt>Phone</dt>
                      <dd>{profile.phone}</dd>
                    </div>
                  )}
                  {profile.preferredTitle && (
                    <div>
                      <dt>Preferred title</dt>
                      <dd>{profile.preferredTitle}</dd>
                    </div>
                  )}
                  {profile.jobTypes && profile.jobTypes.length > 0 && (
                    <div>
                      <dt>Job types</dt>
                      <dd>
                        <div className="admin-users__chips">
                          {profile.jobTypes.map((t) => (
                            <span key={t} className="admin-users__chip">
                              {t}
                            </span>
                          ))}
                        </div>
                      </dd>
                    </div>
                  )}
                  {pay && (
                    <div>
                      <dt>Min. pay</dt>
                      <dd>{pay}</dd>
                    </div>
                  )}
                  <div>
                    <dt>Remote OK</dt>
                    <dd>{profile.remoteOk ? 'Yes' : 'No'}</dd>
                  </div>
                  {profile.skills && profile.skills.length > 0 && (
                    <div>
                      <dt>Skills</dt>
                      <dd>
                        <div className="admin-users__chips">
                          {profile.skills.map((s) => (
                            <span key={s} className="admin-users__chip">
                              {s}
                            </span>
                          ))}
                        </div>
                      </dd>
                    </div>
                  )}
                  {profile.needsResumeHelp && (
                    <div>
                      <dt>Resume help</dt>
                      <dd>Requested</dd>
                    </div>
                  )}
                </dl>
              )}
            </div>

            {/* Resume + applications */}
            <div className="admin-users__panel">
              <h4 className="admin-users__panel-title">Resume</h4>
              {selected.resume ? (
                <div className="admin-users__resume">
                  <p className="admin-users__resume-name">{selected.resume.fileName}</p>
                  <p className="admin-users__resume-meta">
                    {formatBytes(selected.resume.size)} · uploaded{' '}
                    {formatDate(selected.resume.uploadedAt)}
                  </p>
                  <button
                    type="button"
                    className="admin__toggle-btn admin__toggle-btn--activate"
                    onClick={handleViewResume}
                    disabled={busy !== null}
                  >
                    {busy === 'resume' ? 'Opening…' : 'View / download resume'}
                  </button>
                </div>
              ) : (
                <p className="admin-users__panel-empty">No resume on file.</p>
              )}

              <h4 className="admin-users__panel-title admin-users__panel-title--spaced">
                Applications ({selected.applications.length})
              </h4>
              {selected.applications.length === 0 ? (
                <p className="admin-users__panel-empty">No applications submitted.</p>
              ) : (
                <ul className="admin-users__apps">
                  {selected.applications.map((a, i) => (
                    <li key={`${a.jobTitle}-${i}`} className="admin-users__app">
                      <span className="admin-users__app-title">{a.jobTitle}</span>
                      <span className="admin-users__app-company">{a.company}</span>
                      <span className="admin-users__app-date">{formatDate(a.createdAt)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      )}

      {confirmDelete && selected && (
        <div
          className="admin-modal__overlay"
          onMouseDown={() => busy !== 'delete' && setConfirmDelete(false)}
          role="presentation"
        >
          <div
            className="admin-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="admin-user-delete-title"
            aria-describedby="admin-user-delete-desc"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <h2 id="admin-user-delete-title" className="admin-modal__title">
              Delete this user?
            </h2>
            <p id="admin-user-delete-desc" className="admin-modal__body">
              This permanently removes <strong>{selected.name}</strong> ({selected.email}) along
              with their profile, resume, and applications. This cannot be undone.
            </p>
            <div className="admin-modal__actions">
              <button
                type="button"
                className="admin-modal__btn admin-modal__btn--cancel"
                onClick={() => setConfirmDelete(false)}
                disabled={busy === 'delete'}
              >
                Cancel
              </button>
              <button
                type="button"
                className="admin-modal__btn admin-modal__btn--confirm"
                onClick={handleDelete}
                disabled={busy === 'delete'}
                autoFocus
              >
                {busy === 'delete' ? 'Deleting…' : 'Delete user'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
