using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using SmartBell.Api.Data.DbContext;

namespace SmartBell.Api.Data.Repositories;

public class GenericRepository<T> : IGenericRepository<T> where T : class
{
    private readonly AppDbContext _db;
    private readonly DbSet<T> _set;

    public GenericRepository(AppDbContext db)
    {
        _db = db;
        _set = _db.Set<T>();
    }

    public async Task<T?> GetByIdAsync(Guid id) => await _set.FindAsync(id);

    public async Task<List<T>> GetAllAsync() => await _set.AsNoTracking().ToListAsync();

    public async Task<List<T>> FindAsync(Expression<Func<T, bool>> predicate)
        => await _set.AsNoTracking().Where(predicate).ToListAsync();

    public IQueryable<T> Query() => _set.AsQueryable();

    public async Task AddAsync(T entity) => await _set.AddAsync(entity);

    public async Task AddRangeAsync(IEnumerable<T> entities) => await _set.AddRangeAsync(entities);

    public void Update(T entity) => _set.Update(entity);

    public void Remove(T entity) => _set.Remove(entity);

    public Task<int> SaveChangesAsync() => _db.SaveChangesAsync();
}
