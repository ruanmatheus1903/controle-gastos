using ControleGastos.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Data;

// Classe de contexto do Entity Framework responsável pelo acesso ao banco da aplicação.
public class AppDbContext : DbContext
{
    // Contexto principal do Entity Framework para acessar pessoas e transações.
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Person> People { get; set; }

    public DbSet<Transaction> Transactions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Define o relacionamento entre pessoa e transações e remove as transações ao excluir a pessoa.
        modelBuilder.Entity<Transaction>()
            .HasOne(t => t.Person)
            .WithMany(p => p.Transactions)
            .HasForeignKey(t => t.PersonId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}