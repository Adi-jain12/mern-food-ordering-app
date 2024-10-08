import { useCreateCheckoutSession } from '@/api/OrderAPI';
import { useGetRestaurantDetails } from '@/api/RestaurantApi';
import CheckoutButton from '@/components/DetailsPage/CheckoutButton';
import MenuItem from '@/components/DetailsPage/MenuItem';
import OrderSummary from '@/components/DetailsPage/OrderSummary';
import RestaurantInfo from '@/components/DetailsPage/RestaurantInfo';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card, CardFooter } from '@/components/ui/card';
import { UserFormData } from '@/forms/user-profile-form/UserProfileForm';
import { MenuItem as MenuItemType } from '@/types';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

export type CartItem = {
	_id: string;
	name: string;
	price: number;
	quantity: number;
};

const DetailsPage = () => {
	const { restaurantId } = useParams();

	const { restaurantDetails, isLoading } =
		useGetRestaurantDetails(restaurantId);

	const { createCheckoutSession, isLoading: isCheckoutLoading } =
		useCreateCheckoutSession();

	const [cartItems, setCartItems] = useState<CartItem[]>(() => {
		// this will check if cart items are stored in session storage and will set the initial state on first load of page by getting the cart item with key for particular restaurant selected.
		const storedCartItems = sessionStorage.getItem(`cartItems-${restaurantId}`);
		return storedCartItems ? JSON.parse(storedCartItems) : [];
	});

	const addToCart = (menuItem: MenuItemType) => {
		setCartItems((prevCartItems) => {
			// 1. check if the item is already in the cart
			const existingCartItems = prevCartItems.find(
				(cartItem) => cartItem._id === menuItem._id
			);

			let updatedCartItems;

			// 2. if item is in cart, update the quantity
			if (existingCartItems) {
				updatedCartItems = prevCartItems.map((cartItem) =>
					cartItem._id === menuItem._id
						? { ...cartItem, quantity: cartItem.quantity + 1 }
						: cartItem
				);
			}

			// 3. if item is not in cart, add it as a new item
			else {
				updatedCartItems = [
					...prevCartItems,
					{
						_id: menuItem._id,
						name: menuItem.name,
						price: menuItem.price,
						quantity: 1,
					},
				];
			}

			// storing cart items in session against key so that we dont loose the items and can retrieve easily when we want
			sessionStorage.setItem(
				`cartItems-${restaurantId}`,
				JSON.stringify(updatedCartItems)
			);

			return updatedCartItems;
		});
	};

	const removeFromCart = (menuItemId: string) => {
		setCartItems((prevCartItems) => {
			const removeCartItem = prevCartItems.filter(
				(cartItem) => cartItem._id !== menuItemId
			);

			sessionStorage.setItem(
				`cartItems-${restaurantId}`,
				JSON.stringify(removeCartItem)
			);

			return removeCartItem;
		});
	};

	const onCheckout = async (userFormData: UserFormData) => {
		if (!restaurantDetails) {
			return;
		}

		const checkoutData = {
			cartItems: cartItems.map((cartItem) => ({
				menuItemId: cartItem._id,
				name: cartItem.name,
				quantity: cartItem.quantity.toString(),
			})),

			restaurantId: restaurantDetails._id,

			deliveryDetails: {
				name: userFormData.name,
				email: userFormData.email as string, // as string, cause email is optional on checkout page as it is read-only field
				country: userFormData.country,
				city: userFormData.city,
				addressLine1: userFormData.addressLine1,
			},
		};

		const data = await createCheckoutSession(checkoutData);
		window.location.href = data.url; // data.url is the url as response getting from backend, so by window.location.href we are saying send the user to the url i.e data.url
	};

	if (isLoading || !restaurantDetails) {
		return <span>Loading...</span>;
	}

	return (
		<div className="flex flex-col gap-10">
			<AspectRatio ratio={16 / 5}>
				<img
					src={restaurantDetails.imageUrl}
					className="rounded-md object-cover h-full w-full"
				/>
			</AspectRatio>

			<div className="grid md:grid-cols-[4fr_2fr] gap-5 md:px-32">
				<div className="flex flex-col gap-4">
					<RestaurantInfo restaurant={restaurantDetails} />
					<span className="text-2xl font-bold tracking-tight">Menu</span>
					{restaurantDetails.menuItems.map((menuItem) => (
						<MenuItem
							menuItem={menuItem}
							addToCart={() => addToCart(menuItem)}
						/>
					))}
				</div>

				<div>
					<Card>
						<OrderSummary
							restaurant={restaurantDetails}
							cartItems={cartItems}
							removeCartItem={removeFromCart}
						/>

						<CardFooter>
							<CheckoutButton
								onCheckout={onCheckout}
								disabled={cartItems.length === 0}
								isLoading={isCheckoutLoading}
							/>
						</CardFooter>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default DetailsPage;
