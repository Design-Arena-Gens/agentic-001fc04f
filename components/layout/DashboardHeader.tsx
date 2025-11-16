"use client";

import { UserProfile } from "../../lib/types";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { EllipsisVerticalIcon, PlusIcon } from "@heroicons/react/24/outline";

interface DashboardHeaderProps {
  currentUser: UserProfile;
  users: UserProfile[];
  onUserChange: (id: string) => void;
  onCreateClick: () => void;
  isSubmitting: boolean;
}

export default function DashboardHeader({ currentUser, users, onUserChange, onCreateClick, isSubmitting }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/60 bg-white/80 backdrop-blur">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3rem] text-primary-600">DocumentManagement</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">Regulated Document Control Portal</h1>
        </div>
        <div className="flex items-center gap-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Acting as</label>
            <select
              value={currentUser.id}
              onChange={(event) => onUserChange(event.target.value)}
              className="mt-1 w-60 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.role})
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={onCreateClick}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 transition hover:bg-primary-500 disabled:cursor-not-allowed disabled:bg-primary-300"
          >
            <PlusIcon className="h-4 w-4" />
            New Controlled Document
          </button>
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 shadow-sm hover:text-primary-600">
              <EllipsisVerticalIcon className="h-5 w-5" />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-60 origin-top-right divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl ring-1 ring-black/5 focus:outline-none">
                <div className="px-4 py-3 text-xs text-slate-500">
                  Real-time audit trails and 21 CFR Part 11 compliant signatures enforced for all approvals.
                </div>
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <span className={`${active ? "bg-slate-100 text-primary-600" : "text-slate-700"} block px-4 py-2 text-sm`}>Download compliance evidence package</span>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <span className={`${active ? "bg-slate-100 text-primary-600" : "text-slate-700"} block px-4 py-2 text-sm`}>Open deviation register</span>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </header>
  );
}
