import { Prisma } from "@prisma/client";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { prisma } from "~/.server/shared/services/prisma.service"
import { containsInsensitive } from "~/.server/shared/utils/prisma.util";
import { ECategoriesSortVariant } from "~/admin/components/categories/Index/Filters";
import { ESoftDeleteStatus } from "~/admin/constants/entries.constant";
import { categoryApiMapper } from "../mappers/categoryApi.mapper";
import {
  makeQuery,
  queryToSearch,
  queryToSort,
  requestToSearchParams,
  sortValueToField
 } from "../utils/query.util";
import { categoryQueryValidator } from "./categories/index/loader";

type CategoryOrderByWithRelationInput = Prisma.CategoryOrderByWithRelationInput;


export async function categoriesApiLoader({request}: LoaderFunctionArgs){
  const searchParams = requestToSearchParams(request);
  const {data} = await categoryQueryValidator.validate(
    searchParams
  );
  const search = await queryToSearch(searchParams);
  const sort = await queryToSort(searchParams, ECategoriesSortVariant, ECategoriesSortVariant.createdAt_desc);
  const orderBy = sortValueToField<CategoryOrderByWithRelationInput>(sort);

  let searchQuery;
  let filterAccountStatusQuery;

  if (search) {
    searchQuery = {
      OR: [
        {title: containsInsensitive(search)},
        {slug: containsInsensitive(search)},
      ]
    };
  }

  if (data?.softDeleteStatus === ESoftDeleteStatus.deleted) {
    filterAccountStatusQuery = {
      deletedAt: {
        not: null
      }
    };
  }

  if (data?.softDeleteStatus === ESoftDeleteStatus.active) {
    filterAccountStatusQuery = {
      deletedAt: null
    };
  }

  const categories = await prisma.category.findMany({
    take: 10,
    where: {
      ...searchQuery,
      deletedAt: null
    },
    orderBy
  });

  return json({categories: categories.map(categoryApiMapper), query: makeQuery(search, sort, data)});
}
