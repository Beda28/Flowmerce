def search(query, model, stype: str = None, keyword: str = None):
    if not keyword or not stype:
        return query

    try:
        target_model_name, column_name = stype.split(".")

        target_model = getattr(model, target_model_name)
        column       = getattr(target_model, column_name)
        return query.where(column.contains(keyword))

    except (AttributeError, ValueError):
        return query
