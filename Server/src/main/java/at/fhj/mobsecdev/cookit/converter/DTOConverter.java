package at.fhj.mobsecdev.cookit.converter;

import java.util.List;

/**
 * Generic converter between objects (as used in the logic layer) and DTO (as used in the presentation layer to avoid leakage of internal data)
 */
public interface DTOConverter<D, E> {

	public D convertToDto(E entity);

	public List<D> convertToDto(List<E> entities);
}