import {useLoaderData} from '@remix-run/react';
import { categoriesApiLoader } from '~/.server/admin/loaders/categoriesApi.loader';

export const loader = categoriesApiLoader;

export default function DashboardIndex() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="font-sans p-4">
      <pre>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
